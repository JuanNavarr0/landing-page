// scripts/indexKnowledgeBase.mjs
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text"; // Para cargar .md como texto plano
// Podrías explorar UnstructuredLoader o similar si necesitas parseo más avanzado de Markdown,
// pero TextLoader con un buen splitter suele ser suficiente.
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import dotenv from "dotenv";

// Cargar variables de entorno desde .env.local (especialmente OPENAI_API_KEY)
dotenv.config({ path: '.env.local' });

const KNOWLEDGE_BASE_PATH = "./knowledge_base"; // Ruta a tu carpeta de documentos
const CHROMA_URL = "http://localhost:8000"; // URL de tu servidor ChromaDB
const CHROMA_COLLECTION_NAME = "solux_corp_knowledge"; // Nombre de la colección en ChromaDB

// Configuración del modelo de embeddings de OpenAI
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-3-small", // Modelo de embedding recomendado y más reciente
  // dimensions: 1536, // Opcional, para text-embedding-3-small puedes especificar dimensiones si es necesario
});

async function main() {
  console.log("Iniciando proceso de indexación de la base de conocimiento...");

  // 1. Cargar Documentos
  // Usamos TextLoader para archivos .md, asumiendo que el frontmatter es parte del texto
  // o que lo manejaremos después si es necesario (LangChain puede extraer metadatos).
  const loader = new DirectoryLoader(
    KNOWLEDGE_BASE_PATH,
    {
      ".md": (path) => new TextLoader(path),
    },
    true // Cargar recursivamente si hay subdirectorios
  );

  console.log(`Cargando documentos desde: ${KNOWLEDGE_BASE_PATH}`);
  const docs = await loader.load();
  console.log(`Se cargaron ${docs.length} documentos.`);

  if (docs.length === 0) {
    console.log("No se encontraron documentos para indexar. Verifica la ruta y los archivos.");
    return;
  }

  // Opcional: Extraer y limpiar metadatos del frontmatter si es necesario
  // Por ahora, asumimos que el contenido completo del .md (incluyendo frontmatter) se indexa.
  // LangChain intentará usar el nombre del archivo como metadato 'source'.
  // Puedes añadir lógica aquí para parsear el frontmatter y añadirlo a `doc.metadata`.
  // Ejemplo simple (requeriría una librería como 'gray-matter'):
  // import matter from 'gray-matter';
  // const processedDocs = docs.map(doc => {
  //   const { data, content } = matter(doc.pageContent);
  //   return {
  //     pageContent: content, // Solo el contenido principal
  //     metadata: { ...doc.metadata, ...data } // Fusionar metadatos
  //   };
  // });

  // 2. Dividir Documentos en Fragmentos (Chunking)
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000, // Tamaño de los fragmentos (en caracteres)
    chunkOverlap: 200, // Solapamiento entre fragmentos para mantener contexto
  });

  console.log("Dividiendo documentos en fragmentos...");
  const chunks = await textSplitter.splitDocuments(docs); // Usar 'docs' o 'processedDocs'
  console.log(`Se crearon ${chunks.length} fragmentos.`);

  if (chunks.length === 0) {
    console.log("No se crearon fragmentos. Verifica el contenido de tus documentos.");
    return;
  }

  // 3. Generar Embeddings y Almacenar en ChromaDB
  console.log(`Conectándose a ChromaDB en ${CHROMA_URL} y preparando la colección '${CHROMA_COLLECTION_NAME}'...`);
  
  try {
    // Inicializar el vector store de Chroma.
    // Esto intentará conectarse al servidor ChromaDB.
    // Si la colección ya existe con un modelo de embedding diferente, podría dar error.
    // Para una primera ejecución, es mejor asegurarse de que la colección no exista o esté vacía,
    // o manejar la eliminación/recreación si es necesario.

    // Para limpiar una colección existente antes de volver a indexar (¡CUIDADO!):
    // const client = new ChromaClient({ path: CHROMA_URL }); // Necesitarías ChromaClient directamente
    // try {
    //   await client.deleteCollection({ name: CHROMA_COLLECTION_NAME });
    //   console.log(`Colección '${CHROMA_COLLECTION_NAME}' eliminada.`);
    // } catch (e) {
    //   console.log(`La colección '${CHROMA_COLLECTION_NAME}' no existía o no se pudo eliminar.`);
    // }

    console.log("Generando embeddings y almacenando en ChromaDB (esto puede tardar)...");
    await Chroma.fromDocuments(chunks, embeddings, {
      collectionName: CHROMA_COLLECTION_NAME,
      url: CHROMA_URL,
      // collectionMetadata: { "hnsw:space": "cosine" }, // Opcional: especificar la métrica de distancia
    });

    console.log(`¡Indexación completada! ${chunks.length} fragmentos almacenados en la colección '${CHROMA_COLLECTION_NAME}'.`);
  } catch (error) {
    console.error("Error durante la indexación en ChromaDB:", error);
    if (error.message && error.message.includes("Add requires embeddings to be passed in")) {
        console.error("Este error puede ocurrir si los embeddings no se generaron correctamente o no se pasaron a ChromaDB.");
    }
    if (error.message && error.message.includes("CollectionOpenAIEmbeddings") && error.message.includes("got an unexpected keyword argument 'model'")) {
        console.error("Este error puede indicar una incompatibilidad de versiones o configuración del modelo de embedding con ChromaDB. Asegúrate que el modelo de OpenAIEmbeddings es compatible.");
    }
     if (error.message && error.message.includes("ECONNREFUSED")) {
        console.error(`Error de conexión con ChromaDB en ${CHROMA_URL}. ¿Está el servidor ChromaDB corriendo en Docker?`);
    }
  }
}

main().catch(console.error);

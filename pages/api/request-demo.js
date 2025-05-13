// pages/api/request-demo.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { name, email, company } = req.body;
  
      // Validación básica (puedes añadir más)
      if (!name || !email) {
        return res.status(400).json({ message: 'Nombre y email son requeridos.' });
      }
  
      // Aquí es donde procesarías el envío del email
      // Por ahora, solo simulamos y logueamos
      console.log('Solicitud de Demo Recibida:');
      console.log('Nombre:', name);
      console.log('Email:', email);
      console.log('Empresa:', company || 'No especificada');
  
      // Simulación de éxito
      // En un caso real, aquí enviarías el email.
      // Si el email se envía correctamente:
      return res.status(200).json({ message: 'Solicitud recibida con éxito.' });
      // Si hay un error al enviar el email:
      // return res.status(500).json({ message: 'Error al procesar la solicitud.' });
  
    } else {
      // Manejar cualquier otro método HTTP
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
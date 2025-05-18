---
id: "analisis-sentimientos"
title: "Análisis de Sentimientos en Redes Sociales"
category: "Marketing"
client_type: "Agencia de Publicidad"
status: "Completado"
date: "2024-07-10"
technologies: ["Python", "NLTK", "Transformers", "FastAPI", "React"]
tags: ["sentiment analysis", "NLP", "social media", "dashboards", "API"]
---

## Descripción General

Este proyecto consistió en desarrollar una plataforma para recoger y analizar en tiempo real las menciones de marca en redes sociales, detectando emociones y tendencias.

## Desafíos Clave

- Procesar grandes volúmenes de datos en streaming (Twitter, Facebook, Instagram).
- Clasificar correctamente ironías y sarcasmos.
- Crear visualizaciones dinámicas para usuarios no técnicos.

## Solución Propuesta por Solux Corp

- Canal de ingesta de datos en streaming con Apache Kafka.
- Pipeline de limpieza y normalización de texto usando NLTK y spaCy.
- Modelos de Transformers (fine-tuning) para clasificación de sentimiento.
- API REST con FastAPI para exponer resultados.
- Dashboard interactivo en React con gráficas de sentimiento y alertas.

## Resultados y Beneficios

- Reducción del 40 % en el tiempo de detección de crisis de reputación.
- Aumento del 30 % en la precisión de clasificación de sentimiento.
- Herramienta usada diariamente por el equipo de marketing para ajustar campañas.

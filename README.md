# 🏥 Sistema de Reservas Médicas – MVP Académico

## Descripción del Proyecto
Sistema web desarrollado como MVP académico que permite registrar citas médicas, validando reglas de negocio básicas como:

- No permitir fechas pasadas
- Evitar conflicto de horarios
- Validación obligatoria de campos
- Control lógico desde backend

El sistema fue desarrollado utilizando Google Apps Script y Google Sheets como base de datos ligera.

---

## Objetivo
Construir un sistema funcional, auditable y replicable que demuestre:

- Aplicación de arquitectura ligera cliente-servidor
- Validaciones en doble capa (frontend y backend)
- Control básico de seguridad
- Pruebas documentadas
- Despliegue funcional como Web App

---

## Arquitectura

Cliente (HTML Form)  
↓  
Google Apps Script (Backend lógico)  
↓  
Google Sheets (Persistencia de datos)

- Arquitectura tipo cliente-servidor ligera
- Backend ejecutado en entorno Google
- Persistencia estructurada en hoja de cálculo

---

## Seguridad Implementada

- Validación de payload en backend
- Regla de fecha futura obligatoria
- Prevención de doble reserva
- Aplicación del principio de menor privilegio en permisos de hoja
- No exposición de credenciales ni claves API

---

## Validaciones Aplicadas

- Campos obligatorios
- Fecha válida y futura
- Validación de conflicto horario
- Mensajes de error descriptivos

---

## Pruebas

Se ejecutaron:

- Pruebas positivas (flujo correcto)
- Pruebas negativas (datos inválidos)
- Pruebas de conflicto horario
- Validación externa en modo incógnito

Ver matriz de pruebas en documentación del proyecto.

---

## Despliegue

El sistema fue desplegado como Web App en Google Apps Script.

### Pasos para replicar:

1. Crear un proyecto en Google Apps Script
2. Copiar el código fuente
3. Vincular hoja de Google Sheets
4. Configurar permisos mínimos necesarios
5. Deploy como Web App

---

## 📂 Estructura del Repositorio

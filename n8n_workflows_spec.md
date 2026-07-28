# AgroSmart n8n Workflows Specification

Este documento contiene las especificaciones de integración entre **n8n**, **Meta WhatsApp Business API** y **Supabase** para AgroSmart.

---

## 📩 WORKFLOW 1: Envíos Diarios de Recordatorios (8:00 AM Cron)

### Diagrama de Flujo
`Schedule Trigger (0 8 * * *)` ➔ `Supabase: GET Pendientes de Hoy` ➔ `Loop Items` ➔ `HTTP Request (Meta WhatsApp API)` ➔ `Supabase: Update whatsapp_reminder_sent = true`

### Consulta SQL en Supabase / Node
```sql
SELECT 
    ca.id AS activity_id,
    ca.activity_type,
    ca.scheduled_date,
    c.name AS crop_name,
    u.id AS user_id,
    u.full_name AS user_name,
    u.whatsapp AS user_whatsapp
FROM crop_activities ca
JOIN crops c ON ca.crop_id = c.id
JOIN users u ON ca.user_id = u.id OR c.user_id = u.id
WHERE ca.scheduled_date = CURRENT_DATE
  AND ca.status = 'pendiente'
  AND ca.whatsapp_reminder_sent = false
  AND u.whatsapp_opt_in = true
  AND u.whatsapp IS NOT NULL;
```

### Payload HTTP Request (Meta Interactive Buttons)
- **URL**: `https://graph.facebook.com/v21.0/{{ $env.WHATSAPP_PHONE_NUMBER_ID }}/messages`
- **Method**: `POST`
- **Header**: `Authorization: Bearer {{ $env.WHATSAPP_ACCESS_TOKEN }}`
- **Body**:
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "{{ $json.user_whatsapp }}",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "header": {
      "type": "text",
      "text": "🌱 AgroSmart"
    },
    "body": {
      "text": "Hola {{ $json.user_name }}\n\nHoy debes realizar el {{ $json.activity_type }} de:\n\n*{{ $json.crop_name }}*\n\nSelecciona una opción a continuación:"
    },
    "action": {
      "buttons": [
        {
          "type": "reply",
          "reply": {
            "id": "btn_done_{{ $json.activity_id }}",
            "title": "🟢 Ya realizado"
          }
        },
        {
          "type": "reply",
          "reply": {
            "id": "btn_later_{{ $json.activity_id }}",
            "title": "🟡 Recordarme tarde"
          }
        },
        {
          "type": "reply",
          "reply": {
            "id": "btn_resched_{{ $json.activity_id }}",
            "title": "🔵 Reprogramar"
          }
        }
      ]
    }
  }
}
```

---

## 🔄 WORKFLOW 2: Receptor Webhook de Interacciones WhatsApp

### Endpoint Webhook en n8n
- **Method**: `POST`
- **Path**: `/webhook/whatsapp-response`

### Lógica del Workflow
1. **Recibir Webhook de Meta**: Extrae `button_reply.id` (ejemplo: `btn_done_105`, `btn_later_105`, `btn_resched_105`).
2. **Switch/Router**:
   - **Caso `btn_done_{id}`**:
     - UPDATE `crop_activities` SET `status = 'realizado'`, `completed_at = NOW()`, `response_received = 'realizado'` WHERE `id = {id}`.
     - Enviar mensaje de respuesta vía WhatsApp:
       *"✅ ¡Excelente! La actividad ha sido registrada como realizada en tu AgroSmart Dashboard."*
   - **Caso `btn_later_{id}`**:
     - UPDATE `crop_activities` SET `scheduled_date = CURRENT_DATE + 1`, `status = 'pendiente'`, `whatsapp_reminder_sent = false`, `response_received = 'recordar_tarde'` WHERE `id = {id}`.
     - Enviar mensaje de respuesta vía WhatsApp:
       *"🟡 Entendido. Te recordaremos realizar esta actividad mañana a las 8:00 AM."*
   - **Caso `btn_resched_{id}`**:
     - UPDATE `crop_activities` SET `status = 'reprogramado'`, `response_received = 'reprogramar'` WHERE `id = {id}`.
     - Enviar mensaje de respuesta vía WhatsApp:
       *"🔵 Por favor ingresa a tu AgroSmart Dashboard para asignar la nueva fecha deseada."*

---

## 🌱 WORKFLOW 3: Autogeneración de Recordatorios al Crear Cultivo

### Endpoint Webhook en n8n
- **Method**: `POST`
- **Path**: `/webhook/create-crop-reminders`

### Body Enviado por el Frontend
```json
{
  "user_id": 42,
  "crop_id": 105,
  "crop_name": "Tomate",
  "sowing_date": "2026-07-24",
  "fertilizer_plan": [
    { "day": 15, "product": "NPK 15-15-15 (10g/planta)", "type": "abonado" },
    { "day": 45, "product": "Nitrato de Calcio (15g/planta)", "type": "fertilización" }
  ]
}
```

### Proceso en n8n
1. Calcula la fecha exacta sumando los días a `sowing_date`.
2. Inserta masivamente en Supabase (`crop_activities`).

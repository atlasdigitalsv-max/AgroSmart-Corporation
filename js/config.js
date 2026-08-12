window.CONFIG = {
    WEATHER_API_KEY: '1a04bb4bae5147c6b7a212859251111',
    OPENWEATHERMAP_API_KEY: ['c68ac2a', '4c771e0b', 'b1ee4a3', 'b0e24bfd81'].join(''),
    OPENAI_API_KEY: '',
    OPENROUTER_API_KEY: '',
    
    // ElevenLabs Hyper-Realistic Voice (Jarvis & Emergency Alerts)
    ELEVENLABS_API_KEY: '0d4e5c21e80a5462701eded857ec524525427a5a34466c2264ff26e29163ae07',
    ELEVENLABS_VOICE_ID: 'pNInz6obpgDQGcFmaJgB', // Adam (Voz Masculina Autoritaria y Clara en Español)
    
    // EmailJS Keys (Necesario para el OTP Real)
    EMAILJS_PUBLIC_KEY: 'J6k3sUQwKLqzQCehd', 
    EMAILJS_SERVICE_ID: 'service_fwpznco', 
    EMAILJS_TEMPLATE_ID: 'template_93q7rks',
 
    // Supabase Cloud Configuration
    SUPABASE_URL: 'https://atahzqmsfuizsxwyikao.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_M9-owcOPq9E-KypfTRwTqA_O5Nf95Pg',

    // n8n Webhook Configuration (WhatsApp-First Communication)
    N8N_WEBHOOK_URL: '', // Base URL de tu instancia n8n, ej: 'https://tu-n8n.com/webhook'
    WHATSAPP_ENABLED: true, // Feature flag para activar/desactivar canal WhatsApp

    // Códigos de país para selector de teléfono (Centroamérica + México + US)
    PHONE_COUNTRY_CODES: [
        { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
        { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
        { code: '+504', country: 'Honduras', flag: '🇭🇳' },
        { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
        { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
        { code: '+507', country: 'Panamá', flag: '🇵🇦' },
        { code: '+501', country: 'Belice', flag: '🇧🇿' },
        { code: '+52',  country: 'México', flag: '🇲🇽' },
        { code: '+1',   country: 'Estados Unidos', flag: '🇺🇸' },
        { code: '+57',  country: 'Colombia', flag: '🇨🇴' },
        { code: '+51',  country: 'Perú', flag: '🇵🇪' },
        { code: '+593', country: 'Ecuador', flag: '🇪🇨' }
    ]
};
const CONFIG = window.CONFIG;

// Preseleccionar automáticamente la IA Madre (GPT-4o) y ElevenLabs en todo el sistema sin entrar a configuración
if (localStorage.getItem('ia_madre_openai_ready') !== 'true') {
    localStorage.setItem('ia_madre_openai_ready', 'true');
    localStorage.setItem('agrosmart_ai_model', 'gpt-4o');
    localStorage.setItem('jarvis_model', 'gpt-4o');
}
localStorage.setItem('elevenlabs_api_key', '0d4e5c21e80a5462701eded857ec524525427a5a34466c2264ff26e29163ae07');

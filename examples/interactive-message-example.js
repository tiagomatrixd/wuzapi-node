import { WuzapiClient } from '../src/index.js';

// Initialize the client
const client = new WuzapiClient({
  baseURL: 'http://localhost:8080',
  token: 'TOKEN' // Replace with your actual token
});

// Example: Send interactive message with multiple menus
async function sendMultiMenuInteractiveMessage() {
  try {
    const response = await client.chat.sendInteractive({
      phone: "120363345575931493@g.us", // Group or individual chat
      message: "Selecione abaixo a opção que deseja visualizar e clique em 'Selecionar'.",
      title: "🔮 Menu Principal",
      footer: "Escolha uma das opções",
      menus: [
        {
          title: "Menu de Signos",
          buttons: [
            {
              displayText: "♈️ Áries",
              buttonID: "?signo aries"
            },
            {
              displayText: "♉️ Touro",
              buttonID: "?signo touro"
            },
            {
              displayText: "♊️ Gêmeos",
              buttonID: "?signo gemeos"
            }
          ]
        },
        {
          title: "Menu de Admin",
          buttons: [
            {
              displayText: "👤 Usuários",
              buttonID: "?admin usuarios"
            },
            {
              displayText: "📊 Relatórios",
              buttonID: "?admin relatorios"
            },
            {
              displayText: "⚙️ Configurações",
              buttonID: "?admin config"
            }
          ]
        },
        {
          title: "Menu de Suporte",
          buttons: [
            {
              displayText: "❓ FAQ",
              buttonID: "?suporte faq"
            },
            {
              displayText: "📞 Contato",
              buttonID: "?suporte contato"
            }
          ]
        }
      ],
      additionalNodes: [
        
      ]
    });

    console.log('Multi-menu interactive message sent successfully:', response);
  } catch (error) {
    console.error('Error sending multi-menu interactive message:', error);
  }
}

async function sendInteractiveMessage() {
  try {
    // Example: Send interactive message with zodiac signs (single menu - backward compatibility)
    const response = await client.chat.sendInteractive({
      phone: "120363345575931493@g.us", // Group or individual chat
      message: "Escolha seu signo para ver a previsão:",
      title: "🔮 Menu de admin",
      footer: "Selecione uma opção",
      buttons: [
        {
          displayText: "♈️ Áries (21/03 - 20/04)",
          buttonID: "?signo aries"
        },
        {
          displayText: "♉️ Touro (21/04 - 20/05)",
          buttonID: "?signo touro"
        },
        {
          displayText: "♊️ Gêmeos (21/05 - 20/06)",
          buttonID: "?signo gemeos"
        }
      ],
      additionalNodes: [
       
      ]
    });

    console.log('Interactive message sent successfully:', response);
  } catch (error) {
    console.error('Error sending interactive message:', error);
  }
}

// Example: Simple interactive message without additional nodes
async function sendSimpleInteractiveMessage() {
  try {
    const response = await client.chat.sendInteractive({
      phone: "5511999999999@c.us", // Individual chat
      message: "Escolha uma opção:",
      title: "Menu Principal",
      footer: "Powered by WuzAPI",
      buttons: [
        {
          displayText: "📊 Ver relatórios",
          buttonID: "menu_reports"
        },
        {
          displayText: "⚙️ Configurações",
          buttonID: "menu_settings"
        },
        {
          displayText: "❓ Ajuda",
          buttonID: "menu_help"
        }
      ]
    });

    console.log('Simple interactive message sent:', response);
  } catch (error) {
    console.error('Error sending simple interactive message:', error);
  }
}

// Run examples
console.log('=== Sending Multi-Menu Interactive Message ===');
sendMultiMenuInteractiveMessage();

console.log('\n=== Sending Single Menu Interactive Message (Backward Compatibility) ===');
sendInteractiveMessage();

console.log('\n=== Sending Simple Interactive Message ===');
sendSimpleInteractiveMessage();
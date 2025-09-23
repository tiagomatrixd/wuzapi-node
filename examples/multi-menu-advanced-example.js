import { WuzapiClient } from '../src/index.js';

// Initialize the client
const client = new WuzapiClient({
  baseURL: 'http://localhost:8080',
  token: 'TOKEN' // Replace with your actual token
});

async function sendMultiMenuUsingHelper() {
  try {
    // Using the helper method for easier multi-menu creation
    const response = await client.chat.sendMultiMenuInteractive(
      "120363345575931493@g.us", // phone
      "Selecione abaixo a opção que deseja visualizar e clique em 'Selecionar'.", // message
      "🔮 Menu Principal", // title
      [ // menus
        {
          title: "Menu de Signos",
          buttons: [
            { displayText: "♈️ Áries", buttonID: "?signo aries" },
            { displayText: "♉️ Touro", buttonID: "?signo touro" },
            { displayText: "♊️ Gêmeos", buttonID: "?signo gemeos" },
            { displayText: "♋️ Câncer", buttonID: "?signo cancer" }
          ]
        },
        {
          title: "Menu de Admin",
          buttons: [
            { displayText: "👤 Usuários", buttonID: "?admin usuarios" },
            { displayText: "📊 Relatórios", buttonID: "?admin relatorios" },
            { displayText: "⚙️ Configurações", buttonID: "?admin config" }
          ]
        },
        {
          title: "Menu de Vendas",
          buttons: [
            { displayText: "💰 Produtos", buttonID: "?vendas produtos" },
            { displayText: "📈 Estatísticas", buttonID: "?vendas stats" },
            { displayText: "🎯 Campanhas", buttonID: "?vendas campanhas" }
          ]
        }
      ],
      "Escolha uma das opções", // footer
      [ // additionalNodes
       
      ]
    );

    console.log('Multi-menu message sent using helper method:', response);
  } catch (error) {
    console.error('Error sending multi-menu message:', error);
  }
}

async function sendDynamicMultiMenu() {
  try {
    // Example with dynamically generated menus
    const signos = [
      { name: "♈️ Áries", id: "aries" },
      { name: "♉️ Touro", id: "touro" },
      { name: "♊️ Gêmeos", id: "gemeos" },
      { name: "♋️ Câncer", id: "cancer" },
      { name: "♌️ Leão", id: "leao" },
      { name: "♍️ Virgem", id: "virgem" }
    ];

    const adminOptions = [
      { name: "👤 Gerenciar Usuários", id: "usuarios" },
      { name: "📊 Ver Relatórios", id: "relatorios" },
      { name: "⚙️ Configurações", id: "config" },
      { name: "🔒 Segurança", id: "seguranca" }
    ];

    const response = await client.chat.sendInteractive({
      phone: "120363345575931493@g.us",
      message: "Sistema completo de navegação - selecione uma categoria:",
      title: "🚀 Central de Comandos",
      footer: "Desenvolvido com WuzAPI Node.js",
      menus: [
        {
          title: "🔮 Horóscopos Disponíveis",
          buttons: signos.map(signo => ({
            displayText: signo.name,
            buttonID: `?horoscopo ${signo.id}`
          }))
        },
        {
          title: "🛠️ Administração",
          buttons: adminOptions.map(option => ({
            displayText: option.name,
            buttonID: `?admin ${option.id}`
          }))
        },
        {
          title: "📋 Utilitários",
          buttons: [
            { displayText: "📅 Agenda", buttonID: "?util agenda" },
            { displayText: "💾 Backup", buttonID: "?util backup" },
            { displayText: "📊 Dashboard", buttonID: "?util dashboard" },
            { displayText: "🔍 Buscar", buttonID: "?util buscar" }
          ]
        }
      ],
      additionalNodes: [
        // You can add additional nodes if needed
      ]
    });

    console.log('Dynamic multi-menu message sent:', response);
  } catch (error) {
    console.error('Error sending dynamic multi-menu message:', error);
  }
}

// Run examples
console.log('=== Using Helper Method ===');
sendMultiMenuUsingHelper();

setTimeout(() => {
  console.log('\n=== Dynamic Multi-Menu Example ===');
  sendDynamicMultiMenu();
}, 2000);
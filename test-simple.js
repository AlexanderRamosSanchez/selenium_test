console.log('🔍 Prueba simple de Selenium...');

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testSimple() {
    console.log('📦 Dependencias cargadas correctamente');

    try {
        console.log('🔧 Configurando Chrome...');

        // Configuración más básica
        const service = new chrome.ServiceBuilder();
        const options = new chrome.Options();

        // Opciones mínimas
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--headless'); // Modo headless para esta prueba

        console.log('🚀 Creando driver...');

        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeService(service)
            .setChromeOptions(options)
            .build();

        console.log('✅ Driver creado exitosamente');

        console.log('🌐 Navegando a Google...');
        await driver.get('https://www.google.com');

        const title = await driver.getTitle();
        console.log('✅ Título de la página:', title);

        await driver.quit();
        console.log('✅ Prueba completada exitosamente');

    } catch (error) {
        console.error('❌ Error:', error.message);

        if (error.message.includes('ChromeDriver')) {
            console.log('💡 Problema con ChromeDriver. Instalando...');
            console.log('📋 Ejecuta: npm install --save-dev chromedriver');
        }

        if (error.message.includes('chrome not found')) {
            console.log('💡 Chrome no encontrado. Asegúrate de tener Google Chrome instalado.');
        }
    }
}

testSimple();

// npm install --save-dev selenium-webdriver chromedriver
// node test-simple.js
// npm run test:login
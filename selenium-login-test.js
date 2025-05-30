console.log('🔧 Iniciando script de Selenium con reporte...');

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// Clase para generar reportes
class TestReporter {
    constructor() {
        this.startTime = new Date();
        this.testResults = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    addTest(name, status, duration, details = '', screenshot = null) {
        this.totalTests++;
        status === 'PASS' ? this.passedTests++ : this.failedTests++;
        this.testResults.push({
            name, status, duration, details, screenshot,
            timestamp: new Date().toISOString()
        });
    }

    generateConsoleReport() {
        const endTime = new Date();
        const totalDuration = (endTime - this.startTime) / 1000;
        const successRate = ((this.passedTests / this.totalTests) * 100).toFixed(1);

        console.log('\n' + '='.repeat(80));
        console.log('📊 REPORTE DE RESULTADOS DE PRUEBAS SELENIUM');
        console.log('='.repeat(80));
        console.log(`🕐 Inicio: ${this.startTime.toLocaleString()}`);
        console.log(`🕐 Fin: ${endTime.toLocaleString()}`);
        console.log(`⏱️ Duración total: ${totalDuration.toFixed(2)}s`);
        console.log(`📝 Total de pruebas: ${this.totalTests}`);
        console.log(`✅ Exitosas: ${this.passedTests}`);
        console.log(`❌ Fallidas: ${this.failedTests}`);
        console.log(`📈 Tasa de éxito: ${successRate}%`);
        console.log('='.repeat(80));

        this.testResults.forEach((test, index) => {
            const statusIcon = test.status === 'PASS' ? '✅' : '❌';
            console.log(`${index + 1}. ${statusIcon} ${test.name}`);
            console.log(`   Estado: ${test.status}`);
            console.log(`   Duración: ${test.duration}ms`);
            if (test.details) console.log(`   Detalles: ${test.details}`);
            console.log('');
        });
    }

    generateHTMLReport() {
        const endTime = new Date();
        const totalDuration = (endTime - this.startTime) / 1000;
        const successRate = ((this.passedTests / this.totalTests) * 100).toFixed(1);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const reportsDir = path.join(__dirname, 'test-reports');

        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Pruebas Selenium</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    animation: {
                        'fade-in': 'fadeIn 0.5s ease-in-out',
                        'slide-up': 'slideUp 0.3s ease-out'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 min-h-screen p-4">
    <div class="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <!-- Header -->
        <div class="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-8 text-center">
            <h1 class="text-4xl font-bold mb-2">🔍 Reporte de Pruebas Selenium</h1>
            <p class="text-xl opacity-90">Dashboard de Pruebas Automatizadas</p>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-8 bg-gray-50">
            <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <h3 class="text-gray-600 font-semibold mb-2">📊 Total de Pruebas</h3>
                <div class="text-3xl font-bold text-blue-600">${this.totalTests}</div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <h3 class="text-gray-600 font-semibold mb-2">✅ Exitosas</h3>
                <div class="text-3xl font-bold text-green-600">${this.passedTests}</div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <h3 class="text-gray-600 font-semibold mb-2">❌ Fallidas</h3>
                <div class="text-3xl font-bold text-red-600">${this.failedTests}</div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <h3 class="text-gray-600 font-semibold mb-2">⏱️ Duración</h3>
                <div class="text-3xl font-bold text-purple-600">${totalDuration.toFixed(2)}s</div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <h3 class="text-gray-600 font-semibold mb-2">📈 Tasa de Éxito</h3>
                <div class="text-3xl font-bold text-orange-600">${successRate}%</div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div class="bg-green-500 h-2 rounded-full transition-all duration-500" style="width: ${successRate}%"></div>
                </div>
            </div>
        </div>

        <!-- Test Results -->
        <div class="p-8">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">📋 Detalles de las Pruebas</h2>
            <div class="space-y-4">
                ${this.testResults.map((test, index) => `
                    <div class="bg-white rounded-lg shadow-md border-l-4 ${test.status === 'PASS' ? 'border-green-500 bg-gradient-to-r from-green-50' : 'border-red-500 bg-gradient-to-r from-red-50'} to-white p-6 hover:shadow-lg transition-shadow duration-300">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-lg font-semibold text-gray-800">${index + 1}. ${test.name}</h3>
                            <span class="px-4 py-2 rounded-full text-sm font-bold text-white ${test.status === 'PASS' ? 'bg-green-500' : 'bg-red-500'}">${test.status}</span>
                        </div>
                        ${test.details ? `<p class="text-gray-600 mb-3">${test.details}</p>` : ''}
                        <div class="flex gap-6 text-sm text-gray-500">
                            <span>⏱️ Duración: ${test.duration}ms</span>
                            <span>🕐 Hora: ${new Date(test.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-800 text-white text-center p-6">
            <p class="mb-1">Reporte generado el ${endTime.toLocaleString()}</p>
            <p class="text-gray-300">Powered by Selenium WebDriver 🚀</p>
        </div>
    </div>
</body>
</html>`;

        const reportPath = path.join(reportsDir, 'index.html');
        fs.writeFileSync(reportPath, html);

        // Copiar screenshots
        const screenshotsDir = path.join(__dirname, 'screenshots');
        const reportScreenshotsDir = path.join(reportsDir, 'screenshots');

        if (fs.existsSync(screenshotsDir)) {
            if (!fs.existsSync(reportScreenshotsDir)) {
                fs.mkdirSync(reportScreenshotsDir, { recursive: true });
            }
            const screenshots = fs.readdirSync(screenshotsDir);
            screenshots.forEach(screenshot => {
                fs.copyFileSync(
                    path.join(screenshotsDir, screenshot),
                    path.join(reportScreenshotsDir, screenshot)
                );
            });
        }

        // Generar resumen JSON
        const summaryData = {
            timestamp: endTime.toISOString(),
            duration: totalDuration,
            totalTests: this.totalTests,
            passedTests: this.passedTests,
            failedTests: this.failedTests,
            successRate,
            testResults: this.testResults
        };

        fs.writeFileSync(
            path.join(reportsDir, 'summary.json'),
            JSON.stringify(summaryData, null, 2)
        );

        console.log(`📄 Reporte HTML generado en: ${reportPath}`);
        console.log(`📁 Directorio del reporte: ${reportsDir}`);
        return { reportPath, reportsDir };
    }
}

// Función para configurar chromedriver
function setupChromeDriver() {
    try {
        const chromedriver = require('chromedriver');
        return new chrome.ServiceBuilder(chromedriver.path);
    } catch (error) {
        console.log('⚠️ Usando chromedriver del sistema...');
        return new chrome.ServiceBuilder();
    }
}

// Función para tomar screenshot
async function takeScreenshot(driver, filename) {
    try {
        const screenshot = await driver.takeScreenshot();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const uniqueFilename = `${timestamp}-${filename}`;
        const screenshotPath = path.join(__dirname, 'screenshots', uniqueFilename);

        if (!fs.existsSync(path.dirname(screenshotPath))) {
            fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
        }

        fs.writeFileSync(screenshotPath, screenshot, 'base64');
        console.log(`📸 Screenshot guardado: ${uniqueFilename}`);
        return screenshotPath;
    } catch (error) {
        console.log('⚠️ Error al tomar screenshot:', error.message);
        return null;
    }
}

async function runLoginTest() {
    const reporter = new TestReporter();
    console.log('📋 Iniciando suite de pruebas de login...');

    let driver, testStartTime;

    try {
        // Test 1: Configuración del navegador
        testStartTime = Date.now();
        console.log('🔧 Configurando ChromeDriver...');

        const service = setupChromeDriver();
        const options = new chrome.Options();
        options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1920,1080');

        console.log('🌐 Iniciando navegador Chrome...');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeService(service)
            .setChromeOptions(options)
            .build();

        reporter.addTest('Configuración del navegador', 'PASS', Date.now() - testStartTime, 'Navegador Chrome iniciado correctamente');

        // Test 2: Navegación a la aplicación
        testStartTime = Date.now();
        console.log('📱 Navegando a la aplicación...');
        await driver.get('http://localhost:4200');
        reporter.addTest('Navegación a la aplicación', 'PASS', Date.now() - testStartTime, 'Navegación exitosa a http://localhost:4200');

        // Test 3: Carga de la página de login
        testStartTime = Date.now();
        console.log('⏳ Esperando que la página cargue...');
        await driver.wait(until.elementLocated(By.css('form')), 10000);
        const screenshot1 = await takeScreenshot(driver, 'login-page.png');
        reporter.addTest('Carga de la página de login', 'PASS', Date.now() - testStartTime, 'Formulario de login detectado correctamente', screenshot1);

        // Test 4-5: Localización e ingreso de email
        testStartTime = Date.now();
        console.log('🔍 Buscando e ingresando email...');
        const emailField = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 5000);
        await emailField.clear();
        await emailField.sendKeys('diego.ramos@vallegrande.edu.pe');
        reporter.addTest('Localización e ingreso de email', 'PASS', Date.now() - testStartTime, 'Email ingresado: diego.ramos@vallegrande.edu.pe');

        // Test 6-7: Localización e ingreso de contraseña
        testStartTime = Date.now();
        console.log('🔐 Buscando e ingresando contraseña...');
        const passwordField = await driver.wait(until.elementLocated(By.css('input[formControlName="password"]')), 5000);
        await passwordField.clear();
        await passwordField.sendKeys('diego123');
        reporter.addTest('Localización e ingreso de contraseña', 'PASS', Date.now() - testStartTime, 'Contraseña ingresada correctamente');

        await driver.sleep(1000);
        const screenshot2 = await takeScreenshot(driver, 'before-login.png');

        // Test 8-9: Localización y clic en botón de login
        testStartTime = Date.now();
        console.log('🖱️ Buscando y haciendo clic en botón de login...');
        const loginButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 5000);
        await loginButton.click();
        reporter.addTest('Localización y clic en botón de login', 'PASS', Date.now() - testStartTime, 'Botón de login clickeado correctamente');

        // Test 10: Verificación del resultado del login
        testStartTime = Date.now();
        console.log('⏳ Esperando respuesta del servidor...');
        await driver.sleep(5000);

        const currentUrl = await driver.getCurrentUrl();
        console.log(`📍 URL actual: ${currentUrl}`);
        const screenshot3 = await takeScreenshot(driver, 'after-login.png');

        if (currentUrl !== 'http://localhost:4200/') {
            reporter.addTest('Verificación del resultado del login', 'PASS', Date.now() - testStartTime, `Login exitoso - URL cambió a: ${currentUrl}`, screenshot3);
        } else {
            try {
                const errorMessage = await driver.findElement(By.css('.error-message, .alert-danger, .ng-invalid'));
                const errorText = await errorMessage.getText();
                reporter.addTest('Verificación del resultado del login', 'FAIL', Date.now() - testStartTime, `Login fallido - Mensaje de error: ${errorText}`, screenshot3);
            } catch {
                reporter.addTest('Verificación del resultado del login', 'FAIL', Date.now() - testStartTime, 'Login fallido - Usuario permaneció en la página de login', screenshot3);
            }
        }

        console.log('🎯 Manteniendo navegador abierto por 5 segundos...');
        await driver.sleep(5000);

    } catch (error) {
        console.error('❌ Error durante la prueba:', error.message);
        const screenshot = await takeScreenshot(driver, 'error-screenshot.png');
        reporter.addTest('Error en la ejecución', 'FAIL', Date.now() - testStartTime, `Error: ${error.message}`, screenshot);
    } finally {
        if (driver) {
            console.log('🔄 Cerrando navegador...');
            await driver.quit();
        }
    }

    // Generar reportes
    reporter.generateConsoleReport();
    const reportResult = reporter.generateHTMLReport();

    return {
        reportPath: reportResult.reportPath,
        reportsDir: reportResult.reportsDir,
        summary: {
            total: reporter.totalTests,
            passed: reporter.passedTests,
            failed: reporter.failedTests,
            successRate: ((reporter.passedTests / reporter.totalTests) * 100).toFixed(1)
        }
    };
}

runLoginTest()
    .then((result) => {
        console.log('🏁 Suite de pruebas completada');
        console.log(`📊 Resumen: ${result.summary.passed}/${result.summary.total} pruebas exitosas (${result.summary.successRate}%)`);
        console.log(`📄 Reporte HTML: ${result.reportPath}`);
        console.log(`📁 Carpeta del reporte: ${result.reportsDir}`);
        console.log(`\n🌐 Para ver el reporte, abre: ${result.reportPath}`);
    })
    .catch(error => console.error('💥 Error fatal:', error));

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
        this.screenshots = [];
    }

    addTest(name, status, duration, details = '', screenshot = null) {
        this.totalTests++;
        if (status === 'PASS') {
            this.passedTests++;
        } else {
            this.failedTests++;
        }

        this.testResults.push({
            name,
            status,
            duration,
            details,
            screenshot,
            timestamp: new Date().toISOString()
        });
    }

    generateConsoleReport() {
        const endTime = new Date();
        const totalDuration = (endTime - this.startTime) / 1000;

        console.log('\n' + '='.repeat(80));
        console.log('📊 REPORTE DE RESULTADOS DE PRUEBAS SELENIUM');
        console.log('='.repeat(80));
        console.log(`🕐 Inicio: ${this.startTime.toLocaleString()}`);
        console.log(`🕐 Fin: ${endTime.toLocaleString()}`);
        console.log(`⏱️ Duración total: ${totalDuration.toFixed(2)}s`);
        console.log(`📝 Total de pruebas: ${this.totalTests}`);
        console.log(`✅ Exitosas: ${this.passedTests}`);
        console.log(`❌ Fallidas: ${this.failedTests}`);
        console.log(`📈 Tasa de éxito: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%`);
        console.log('='.repeat(80));

        this.testResults.forEach((test, index) => {
            const statusIcon = test.status === 'PASS' ? '✅' : '❌';
            console.log(`${index + 1}. ${statusIcon} ${test.name}`);
            console.log(`   Estado: ${test.status}`);
            console.log(`   Duración: ${test.duration}ms`);
            if (test.details) {
                console.log(`   Detalles: ${test.details}`);
            }
            console.log('');
        });
    }

    generateHTMLReport() {
        const endTime = new Date();
        const totalDuration = (endTime - this.startTime) / 1000;

        // Crear carpeta de reportes con timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const reportsDir = path.join(__dirname, 'test-reports');

        // Crear directorios si no existen
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Pruebas Selenium</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .summary-card:hover {
            transform: translateY(-5px);
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .summary-card .value {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .total { color: #007bff; }
        .duration { color: #6f42c1; }
        .success-rate { color: #fd7e14; }
        .tests-container {
            padding: 30px;
        }
        .test-item {
            background: white;
            margin: 15px 0;
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid #ddd;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        .test-item:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .test-item.pass {
            border-left-color: #28a745;
            background: linear-gradient(90deg, rgba(40,167,69,0.1) 0%, rgba(255,255,255,1) 10%);
        }
        .test-item.fail {
            border-left-color: #dc3545;
            background: linear-gradient(90deg, rgba(220,53,69,0.1) 0%, rgba(255,255,255,1) 10%);
        }
        .test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .test-name {
            font-size: 1.2em;
            font-weight: bold;
            color: #333;
        }
        .test-status {
            padding: 5px 15px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
            font-size: 0.9em;
        }
        .test-status.pass {
            background: #28a745;
        }
        .test-status.fail {
            background: #dc3545;
        }
        .test-details {
            color: #666;
            margin-top: 10px;
        }
        .test-meta {
            display: flex;
            gap: 20px;
            margin-top: 10px;
            font-size: 0.9em;
            color: #888;
        }
        .footer {
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            border-radius: 10px;
            transition: width 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Reporte de Pruebas Selenium</h1>
            <p>Dashboard de Pruebas Automatizadas</p>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>📊 Total de Pruebas</h3>
                <div class="value total">${this.totalTests}</div>
            </div>
            <div class="summary-card">
                <h3>✅ Exitosas</h3>
                <div class="value passed">${this.passedTests}</div>
            </div>
            <div class="summary-card">
                <h3>❌ Fallidas</h3>
                <div class="value failed">${this.failedTests}</div>
            </div>
            <div class="summary-card">
                <h3>⏱️ Duración Total</h3>
                <div class="value duration">${totalDuration.toFixed(2)}s</div>
            </div>
            <div class="summary-card">
                <h3>📈 Tasa de Éxito</h3>
                <div class="value success-rate">${((this.passedTests / this.totalTests) * 100).toFixed(1)}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(this.passedTests / this.totalTests) * 100}%"></div>
                </div>
            </div>
        </div>

        <div class="tests-container">
            <h2>📋 Detalles de las Pruebas</h2>
            ${this.testResults.map((test, index) => `
                <div class="test-item ${test.status.toLowerCase()}">
                    <div class="test-header">
                        <div class="test-name">${index + 1}. ${test.name}</div>
                        <div class="test-status ${test.status.toLowerCase()}">${test.status}</div>
                    </div>
                    ${test.details ? `<div class="test-details">${test.details}</div>` : ''}
                    <div class="test-meta">
                        <span>⏱️ Duración: ${test.duration}ms</span>
                        <span>🕐 Hora: ${new Date(test.timestamp).toLocaleTimeString()}</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="footer">
            <p>Reporte generado el ${endTime.toLocaleString()}</p>
            <p>Powered by Selenium WebDriver 🚀</p>
        </div>
    </div>
</body>
</html>`;

        const reportPath = path.join(reportsDir, 'index.html');
        fs.writeFileSync(reportPath, html);

        // Copiar screenshots al directorio del reporte
        const screenshotsDir = path.join(__dirname, 'screenshots');
        const reportScreenshotsDir = path.join(reportsDir, 'screenshots');

        if (fs.existsSync(screenshotsDir)) {
            if (!fs.existsSync(reportScreenshotsDir)) {
                fs.mkdirSync(reportScreenshotsDir, { recursive: true });
            }

            // Copiar archivos de screenshots
            const screenshots = fs.readdirSync(screenshotsDir);
            screenshots.forEach(screenshot => {
                const sourcePath = path.join(screenshotsDir, screenshot);
                const destPath = path.join(reportScreenshotsDir, screenshot);
                fs.copyFileSync(sourcePath, destPath);
            });
        }

        // Generar archivo de resumen JSON
        const summaryData = {
            timestamp: endTime.toISOString(),
            duration: totalDuration,
            totalTests: this.totalTests,
            passedTests: this.passedTests,
            failedTests: this.failedTests,
            successRate: ((this.passedTests / this.totalTests) * 100).toFixed(1),
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
        const service = new chrome.ServiceBuilder(chromedriver.path);
        return service;
    } catch (error) {
        console.log('⚠️ Usando chromedriver del sistema...');
        return new chrome.ServiceBuilder();
    }
}

// Función para tomar screenshot
async function takeScreenshot(driver, filename) {
    try {
        const screenshot = await driver.takeScreenshot();

        // Crear timestamp para archivos únicos
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const uniqueFilename = `${timestamp}-${filename}`;
        const screenshotPath = path.join(__dirname, 'screenshots', uniqueFilename);

        // Crear directorio si no existe
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

    let driver;
    let testStartTime;

    try {
        // Test 1: Configuración del navegador
        testStartTime = Date.now();
        console.log('🔧 Configurando ChromeDriver...');
        const service = setupChromeDriver();

        console.log('🔧 Configurando opciones de Chrome...');
        const options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
        options.addArguments('--window-size=1920,1080');

        console.log('🌐 Iniciando navegador Chrome...');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeService(service)
            .setChromeOptions(options)
            .build();

        reporter.addTest(
            'Configuración del navegador',
            'PASS',
            Date.now() - testStartTime,
            'Navegador Chrome iniciado correctamente'
        );

        // Test 2: Navegación a la aplicación
        testStartTime = Date.now();
        console.log('📱 Navegando a la aplicación...');
        await driver.get('http://localhost:4200');

        reporter.addTest(
            'Navegación a la aplicación',
            'PASS',
            Date.now() - testStartTime,
            'Navegación exitosa a http://localhost:4200'
        );

        // Test 3: Carga de la página de login
        testStartTime = Date.now();
        console.log('⏳ Esperando que la página cargue...');
        await driver.wait(until.elementLocated(By.css('form')), 10000);

        const screenshot1 = await takeScreenshot(driver, 'login-page.png');

        reporter.addTest(
            'Carga de la página de login',
            'PASS',
            Date.now() - testStartTime,
            'Formulario de login detectado correctamente',
            screenshot1
        );

        // Test 4: Localización del campo email
        testStartTime = Date.now();
        console.log('🔍 Buscando campo de email...');
        const emailField = await driver.wait(
            until.elementLocated(By.css('input[type="email"]')),
            5000
        );

        reporter.addTest(
            'Localización del campo email',
            'PASS',
            Date.now() - testStartTime,
            'Campo de email encontrado y accesible'
        );

        // Test 5: Ingreso de email
        testStartTime = Date.now();
        console.log('✉️ Ingresando email...');
        await emailField.clear();
        await emailField.sendKeys('diego.ramos@vallegrande.edu.pe');

        reporter.addTest(
            'Ingreso de email',
            'PASS',
            Date.now() - testStartTime,
            'Email ingresado: diego.ramos@vallegrande.edu.pe'
        );

        // Test 6: Localización del campo contraseña
        testStartTime = Date.now();
        console.log('🔍 Buscando campo de contraseña...');
        const passwordField = await driver.wait(
            until.elementLocated(By.css('input[formControlName="password"]')),
            5000
        );

        reporter.addTest(
            'Localización del campo contraseña',
            'PASS',
            Date.now() - testStartTime,
            'Campo de contraseña encontrado y accesible'
        );

        // Test 7: Ingreso de contraseña
        testStartTime = Date.now();
        console.log('🔐 Ingresando contraseña...');
        await passwordField.clear();
        await passwordField.sendKeys('diego123');

        reporter.addTest(
            'Ingreso de contraseña',
            'PASS',
            Date.now() - testStartTime,
            'Contraseña ingresada correctamente'
        );

        await driver.sleep(1000);

        // Screenshot antes del login
        const screenshot2 = await takeScreenshot(driver, 'before-login.png');

        // Test 8: Localización del botón de login
        testStartTime = Date.now();
        console.log('🔍 Buscando botón de login...');
        const loginButton = await driver.wait(
            until.elementLocated(By.css('button[type="submit"]')),
            5000
        );

        reporter.addTest(
            'Localización del botón de login',
            'PASS',
            Date.now() - testStartTime,
            'Botón de submit encontrado y clickeable'
        );

        // Test 9: Clic en el botón de login
        testStartTime = Date.now();
        console.log('🖱️ Haciendo clic en el botón de login...');
        await loginButton.click();

        reporter.addTest(
            'Clic en el botón de login',
            'PASS',
            Date.now() - testStartTime,
            'Clic ejecutado correctamente en el botón de login'
        );

        // Test 10: Verificación del resultado del login
        testStartTime = Date.now();
        console.log('⏳ Esperando respuesta del servidor...');
        await driver.sleep(5000);

        const currentUrl = await driver.getCurrentUrl();
        console.log(`📍 URL actual: ${currentUrl}`);

        const screenshot3 = await takeScreenshot(driver, 'after-login.png');

        if (currentUrl !== 'http://localhost:4200/') {
            reporter.addTest(
                'Verificación del resultado del login',
                'PASS',
                Date.now() - testStartTime,
                `Login exitoso - URL cambió a: ${currentUrl}`,
                screenshot3
            );
        } else {
            // Verificar si hay mensajes de error
            try {
                const errorMessage = await driver.findElement(By.css('.error-message, .alert-danger, .ng-invalid'));
                const errorText = await errorMessage.getText();
                reporter.addTest(
                    'Verificación del resultado del login',
                    'FAIL',
                    Date.now() - testStartTime,
                    `Login fallido - Mensaje de error: ${errorText}`,
                    screenshot3
                );
            } catch {
                reporter.addTest(
                    'Verificación del resultado del login',
                    'FAIL',
                    Date.now() - testStartTime,
                    'Login fallido - Usuario permaneció en la página de login',
                    screenshot3
                );
            }
        }

        console.log('🎯 Manteniendo navegador abierto por 5 segundos...');
        await driver.sleep(5000);

    } catch (error) {
        console.error('❌ Error durante la prueba:', error.message);

        const screenshot = await takeScreenshot(driver, 'error-screenshot.png');

        reporter.addTest(
            'Error en la ejecución',
            'FAIL',
            Date.now() - testStartTime,
            `Error: ${error.message}`,
            screenshot
        );
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

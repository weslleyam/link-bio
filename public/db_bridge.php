<?php
// PHP bridge for MySQL on Hostinger
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configurações do Banco de Dados (Hostinger)
$host = 'localhost';
$dbname = 'u123456789_biolink'; // Substitua pelo seu banco
$user = 'u123456789_user';     // Substitua pelo seu usuário
$pass = 'SuaSenhaAqui';        // Substitua pela sua senha

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['error' => 'Falha na conexão: ' . $e->getMessage()]));
}

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($action === 'save_user') {
        $stmt = $pdo->prepare("REPLACE INTO users (id, name, email, username, passwordHash, createdAt, status, subscriptionStatus, trialExpiresAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$data['id'], $data['name'], $data['email'], $data['username'], $data['passwordHash'], $data['createdAt'], $data['status'], $data['subscriptionStatus'], $data['trialExpiresAt']]);
        echo json_encode(['success' => true]);
    }

    if ($action === 'request_subscription') {
        // Simulação de envio de e-mail para o ADMIN
        // Em um servidor real, você usaria mail() ou uma biblioteca como PHPMailer
        $to = 'admin@teste.com';
        $subject = 'Solicitação de Renovação de Plano';
        $message = "Cliente solicitou renovação de plano:\n\n" .
                   "Nome: " . $data['name'] . "\n" .
                   "Email: " . $data['email'] . "\n" .
                   "ID: " . $data['id'];
        
        // Log para simulação
        error_log("E-mail enviado para $to: $subject\n$message");
        
        echo json_encode(['success' => true]);
    }
    
    if ($action === 'save_page') {
        $stmt = $pdo->prepare("REPLACE INTO pages (id, userId, title, description, theme, profileImage, customCss) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$data['id'], $data['userId'], $data['title'], $data['description'], $data['theme'], $data['profileImage'], $data['customCss']]);
        echo json_encode(['success' => true]);
    }

    if ($action === 'save_link') {
        $stmt = $pdo->prepare("REPLACE INTO links (id, bioPageId, title, url, icon, position, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$data['id'], $data['bioPageId'], $data['title'], $data['url'], $data['icon'], $data['position'], $data['isActive'] ? 1 : 0]);
        echo json_encode(['success' => true]);
    }

    if ($action === 'save_product') {
        $stmt = $pdo->prepare("REPLACE INTO products (id, bioPageId, title, description, price, imageUrl, link, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$data['id'], $data['bioPageId'], $data['title'], $data['description'], $data['price'], $data['imageUrl'], $data['link'], $data['position']]);
        echo json_encode(['success' => true]);
    }
} else {
    if ($action === 'sync_all') {
        $users = $pdo->query("SELECT * FROM users")->fetchAll(PDO::FETCH_ASSOC);
        $pages = $pdo->query("SELECT * FROM pages")->fetchAll(PDO::FETCH_ASSOC);
        $links = $pdo->query("SELECT * FROM links")->fetchAll(PDO::FETCH_ASSOC);
        $products = $pdo->query("SELECT * FROM products")->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'users' => $users,
            'pages' => $pages,
            'links' => $links,
            'products' => $products
        ]);
    }
    
    if ($action === 'delete_link') {
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM links WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    }

    if ($action === 'delete_product') {
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    }
}

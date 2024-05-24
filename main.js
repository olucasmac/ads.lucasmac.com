// Função para obter o valor de um parâmetro da URL
function getParameterByName(name) {
    const url = window.location.href;
    const nameEscaped = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + nameEscaped + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Função para verificar se a URL é do YouTube
function isYouTubeUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
}

// Função para verificar se a URL é do Reddit
function isRedditUrl(url) {
    const redditRegex = /^(https?:\/\/)?(www\.)?reddit\.com\/.+$/;
    return redditRegex.test(url);
}

// Função para obter o ID do vídeo do YouTube a partir da URL
function getYouTubeId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : null;
}

// Função para obter o embed do Reddit
function getRedditEmbedUrl(url) {
    // Usamos o URL de embed padrão do Reddit
    return `https://www.redditmedia.com${url.split('reddit.com')[1]}?ref_source=embed&ref=share&embed=true`;
}

// Função para codificar os parâmetros da URL
function encodeUrlParameters(url) {
    const [baseUrl, queryString] = url.split('?');
    if (!queryString) return baseUrl;
    const encodedParams = queryString.split('&').map(param => {
        const [key, value] = param.split('=');
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }).join('&');
    return `${baseUrl}?${encodedParams}`;
}

// Função para detectar bloqueadores de anúncios
function detectAdBlock() {
    const adBlockEnabled = document.createElement('div');
    adBlockEnabled.className = 'adsbygoogle';
    adBlockEnabled.style.display = 'none';
    document.body.appendChild(adBlockEnabled);
    if (window.getComputedStyle(adBlockEnabled).display === 'none') {
        return true;
    }
    document.body.removeChild(adBlockEnabled);
    return false;
}

// Mostra a mensagem se o bloqueador de anúncios estiver ativo
if (detectAdBlock()) {
    document.getElementById('ad-blocker-warning').classList.remove('hidden');
}

// Obtém o valor do parâmetro 'url' da URL
let rawVideoUrl = getParameterByName('url');
console.log('Raw Video URL:', rawVideoUrl);  // Depuração: Exibir a URL do vídeo antes de codificação

// Processa a URL do vídeo para codificar os parâmetros
let processedVideoUrl = encodeUrlParameters(rawVideoUrl);
console.log('Processed Video URL:', processedVideoUrl);  // Depuração: Exibir a URL do vídeo após processamento

// Se a URL do vídeo estiver presente
if (processedVideoUrl) {
    if (isYouTubeUrl(processedVideoUrl)) {
        // Se a URL for do YouTube, insira o embed do YouTube
        const youtubeId = getYouTubeId(processedVideoUrl);
        console.log('YouTube ID:', youtubeId);  // Depuração: Exibir o ID do YouTube
        if (youtubeId) {
            const youtubeEmbed = document.getElementById('youtube-embed');
            youtubeEmbed.src = `https://www.youtube.com/embed/${youtubeId}`;
            youtubeEmbed.style.display = 'block';
            console.log('YouTube embed set');  // Depuração: Confirmar embed do YouTube
        }
    } else if (isRedditUrl(processedVideoUrl)) {
        // Se a URL for do Reddit, insira o embed do Reddit
        const redditEmbedUrl = getRedditEmbedUrl(processedVideoUrl);
        const redditEmbed = document.createElement('iframe');
        redditEmbed.src = redditEmbedUrl;
        redditEmbed.className = 'reddit-embed';
        document.getElementById('video-container').appendChild(redditEmbed);
        console.log('Reddit embed set:', redditEmbedUrl);  // Depuração: Confirmar embed do Reddit
    } else {
        // Se não for do YouTube ou do Reddit, insira como source do vídeo
        const videoSource = document.getElementById('video-source');
        videoSource.src = processedVideoUrl;  // Use a URL processada diretamente
        const video = document.getElementById('main-video');
        video.style.display = 'block';
        video.load();
        console.log('Video source set and loaded');  // Depuração

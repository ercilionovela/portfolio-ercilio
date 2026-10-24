/* =========================================================
   ATIVAÇÃO DO JAVASCRIPT

   Adicionamos a classe "js" ao <html> para que o CSS
   só esconda os elementos de animação quando o
   JavaScript está realmente a funcionar.
========================================================= */

document.documentElement.classList.add("js");



/* =========================================================
   ANIMAÇÃO DOS ELEMENTOS AO ENTRAREM NA TELA
========================================================= */

/*
    Selecionamos os elementos que queremos animar.
    Aqui podemos adicionar ou remover elementos.
*/

const elementos = document.querySelectorAll(
    ".section-heading, .about-image, .about-text, .project-card, .skill-card, .template-card, .contact-section"
);



/*
    Criamos o observador.

    Ele verifica quando um elemento aparece
    dentro da tela do utilizador.
*/

const observador = new IntersectionObserver(

    (entradas) => {

        entradas.forEach((entrada) => {

            /*
                Se o elemento entrou na tela...
            */

            if (entrada.isIntersecting) {

                /*
                    Adicionamos a classe "aparecer"
                */

                entrada.target.classList.add("aparecer");


                /*
                    Quando a animação de entrada termina,
                    removemos o atraso em cascata.

                    Assim, os toques e hovers nos cartões
                    respondem na hora, sem espera.
                */

                const atrasoEntrada =
                    parseFloat(entrada.target.style.transitionDelay) || 0;

                setTimeout(() => {

                    entrada.target.style.transitionDelay = "";

                }, atrasoEntrada + 850);


                /*
                    Depois de aparecer,
                    deixamos de observar o elemento.
                */

                observador.unobserve(entrada.target);

            }

        });

    },

    {
        /*
            15% do elemento precisa estar visível
            para iniciar a animação.
        */

        threshold: 0.15
    }

);



/*
    Adicionamos a classe inicial
    "animar" a todos os elementos.
*/

elementos.forEach((elemento) => {

    elemento.classList.add("animar");


    /*
        Efeito em cascata nos cartões:

        cada cartão entra um pouco depois do anterior,
        criando um efeito mais dinâmico.
    */

    const classeCartao = ["project-card", "skill-card", "template-card"]
        .find((classe) => elemento.classList.contains(classe));


    if (classeCartao) {

        /*
            Descobrimos a posição do cartão
            entre os seus irmãos da mesma classe.
        */

        const posicao = Array.from(elemento.parentElement.children)
            .filter((irmao) => irmao.classList.contains(classeCartao))
            .indexOf(elemento);


        /*
            Cada cartão espera 120ms extra
            em relação ao anterior.

            Limitamos o atraso máximo a 360ms:
            no telemóvel (uma coluna) os últimos
            cartões não ficam assim mais de um
            terço de segundo à espera.
        */

        const atraso = Math.min(posicao * 120, 360);

        elemento.style.transitionDelay = atraso + "ms";

    }


    observador.observe(elemento);

});



/* =========================================================
   MENU MOBILE (HAMBÚRGUER)
========================================================= */

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");


/*
    Função que fecha o menu.
    Usada em vários momentos: clique num link,
    clique fora do menu e tecla Esc.
*/

function fecharMenu() {

    hamburger.classList.remove("ativo");

    menu.classList.remove("aberto");

    hamburger.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-aberto");

}


/*
    Clicar no botão abre ou fecha o menu.
*/

hamburger.addEventListener("click", () => {

    const estaAberto = menu.classList.toggle("aberto");

    hamburger.classList.toggle("ativo", estaAberto);

    hamburger.setAttribute("aria-expanded", String(estaAberto));

    document.body.classList.toggle("menu-aberto", estaAberto);

});


/*
    Clicar num link do menu fecha-o.
*/

menu.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", fecharMenu);

});


/*
    Clicar fora do menu fecha-o.
*/

document.addEventListener("click", (evento) => {

    if (!hamburger.contains(evento.target) && !menu.contains(evento.target)) {

        fecharMenu();

    }

});


/*
    A tecla Esc também fecha o menu.
*/

document.addEventListener("keydown", (evento) => {

    if (evento.key === "Escape") fecharMenu();

});



/* =========================================================
   EFEITOS AO ROLAR A PÁGINA

   Barra de progresso, sombra na navegação,
   botão voltar ao topo e parallax.
========================================================= */

const header = document.querySelector(".header");
const progressBar = document.getElementById("progressBar");
const backToTop = document.getElementById("backToTop");
const heroImage = document.querySelector(".hero-image");


/*
    Respeita quem prefere menos movimento.
*/

const reduzirAnimacao =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


function aoRolar() {

    /*
        1. Barra de progresso de leitura.
    */

    const alturaTotal =
        document.documentElement.scrollHeight - window.innerHeight;

    const progresso = alturaTotal > 0 ? (window.scrollY / alturaTotal) * 100 : 0;

    progressBar.style.width = progresso + "%";


    /*
        2. Sombra na barra de navegação.
    */

    header.classList.toggle("com-sombra", window.scrollY > 50);


    /*
        3. Botão voltar ao topo.
    */

    backToTop.classList.toggle("visivel", window.scrollY > 400);


    /*
        4. Parallax suave na imagem principal.

        A imagem desce um pouco mais devagar
        do que o resto da página.
    */

    if (!reduzirAnimacao && heroImage && window.scrollY < window.innerHeight) {

        heroImage.style.transform = "translateY(" + (window.scrollY * 0.12) + "px)";

    }

}


/*
    A cada rolagem, atualizamos a barra de progresso,
    a sombra da navegação, o botão voltar ao topo
    e o efeito parallax.
*/

window.addEventListener("scroll", aoRolar, { passive: true });


/*
    Botão volta ao topo com rolagem suave.
*/

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: reduzirAnimacao ? "auto" : "smooth"

    });

});



/* =========================================================
   LINK ATIVO NO MENU

   Destaca no menu a secção
   que está visível na tela.
========================================================= */

const secoes = document.querySelectorAll("section[id]");
const linksMenu = document.querySelectorAll(".menu a");


const observadorSecoes = new IntersectionObserver(

    (entradas) => {

        entradas.forEach((entrada) => {

            if (entrada.isIntersecting) {

                linksMenu.forEach((link) => {

                    link.classList.toggle(
                        "ativo",
                        link.getAttribute("href") === "#" + entrada.target.id
                    );

                });

            }

        });

    },

    {
        /*
            A secção precisa de passar pelo meio
            da tela para ser considerada ativa.
        */

        rootMargin: "-45% 0px -50% 0px"
    }

);


secoes.forEach((secao) => observadorSecoes.observe(secao));



/*
    Aplicamos o estado correto logo no início,
    por exemplo quando a página é recarregada
    a meio do scroll.
*/

aoRolar();



/* =========================================================
   LIGHTBOX (MODAL DE IMAGEM)

   Permite ampliar imagens ao clicar nelas.
========================================================= */

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");

/*
    GALERIAS DO LIGHTBOX

    As galerias são independentes entre si:
    os mapas (Projetos) e os templates cada um
    tem a sua lista, e o contador/setas só
    percorrem a galeria aberta.

    A galeria é identificada pelo grupo:
    - itens de "Projetos"  → grupo "projetos"
    - cartões de "Templates" → grupo "templates"

    Os botões "Visualizar" dos templates têm
    data-lightbox-src mas NÃO entram nas listas:
    eles apenas abrem o lightbox apontando para
    o cartão do template correspondente.
*/

function grupoDoItem(item) {

    if (item.classList.contains("project-image")) {
        return "projetos";
    }

    if (item.classList.contains("template-card")) {
        return "templates";
    }

    return "projetos";

}

function itensDoGrupo(nomeGrupo) {

    return imagensLightbox.filter(
        (item) => grupoDoItem(item) === nomeGrupo
    );

}

const imagensLightbox = Array.from(
    document.querySelectorAll(".project-image[data-lightbox-src], .template-card[data-lightbox-src]")
);

const previewTemplates = Array.from(
    document.querySelectorAll(".template-preview")
);

let indiceAtual = 0;

let galeriaAtual = "projetos";


/*
    Abre o lightbox mostrando a imagem selecionada
    da galeria atual.
*/
function abrirLightbox(indice, grupo) {

    if (grupo) {
        galeriaAtual = grupo;
    }

    const itens = itensDoGrupo(galeriaAtual);

    if (itens.length === 0) return;

    indiceAtual = indice;

    const item = itens[indice];

    lightboxImg.src = item.getAttribute("data-lightbox-src");

    lightboxImg.alt = item.getAttribute("data-lightbox-alt");

    lightboxCaption.textContent = item.getAttribute("data-lightbox-caption");

    lightboxCounter.textContent = (indice + 1) + " / " + itens.length;

    lightbox.classList.add("aberto");

    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

}


/*
    Fecha o lightbox.
*/
function fecharLightbox() {

    lightbox.classList.remove("aberto");

    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


/*
    Navega para a imagem seguinte
    (dentro da galeria atual).
*/
function proximaImagem() {

    const total = itensDoGrupo(galeriaAtual).length;

    indiceAtual = (indiceAtual + 1) % total;

    abrirLightbox(indiceAtual);

}


/*
    Navega para a imagem anterior
    (dentro da galeria atual).
*/
function imagemAnterior() {

    const total = itensDoGrupo(galeriaAtual).length;

    indiceAtual = (indiceAtual - 1 + total) % total;

    abrirLightbox(indiceAtual);

}


/* Eventos: clique nos itens das galerias */
imagensLightbox.forEach((item) => {

    item.addEventListener("click", (evento) => {

        /*
            Os botões dentro de ".template-actions" (Baixar e
            Visualizar) têm os seus próprios tratadores.
            Sem este teste, o clique no Baixar subia até ao cartão
            e abria o lightbox por cima do download — o utilizador
            tinha de fechar a pré-visualização para ver o ficheiro.
        */
        if (evento.target.closest(".template-actions")) return;

        const itens = itensDoGrupo(grupoDoItem(item));

        abrirLightbox(itens.indexOf(item), grupoDoItem(item));

    });

});


/*
    Eventos: previews dos templates.

    Clicar na imagem do template é a mesma coisa
    que clicar no botão "Visualizar" do cartão.
*/
previewTemplates.forEach((preview) => {

    preview.addEventListener("click", () => {

        const cartao = preview.closest(".template-card");

        if (!cartao) return;

        const itens = itensDoGrupo("templates");

        const indice = itens.indexOf(cartao);

        if (indice !== -1) {

            abrirLightbox(indice, "templates");

        }

    });

});


/*
    Eventos: botões "Visualizar" dos templates.

    Abrimos o lightbox apontando para o cartão
    que contém o botão (em vez de usar o index
    global), garantindo que a galeria correta
    é usada.
*/
document.querySelectorAll(".visualizar-template").forEach((botao) => {

    botao.addEventListener("click", () => {

        const cartao = botao.closest(".template-card");

        if (!cartao) return;

        const itens = itensDoGrupo("templates");

        const indice = itens.indexOf(cartao);

        if (indice !== -1) {

            abrirLightbox(indice, "templates");

        }

    });

});


/* Eventos: botões e overlay */
lightboxClose.addEventListener("click", fecharLightbox);
lightboxPrev.addEventListener("click", imagemAnterior);
lightboxNext.addEventListener("click", proximaImagem);


/* Fechar ao clicar no overlay escuro */
lightbox.querySelector(".lightbox-overlay").addEventListener("click", fecharLightbox);


/*
    Os links "Ver projeto" dentro de cada cartão
    também abrem o lightbox com a imagem respetiva.
*/
document.querySelectorAll(".project-link").forEach((link) => {

    link.addEventListener("click", (evento) => {

        evento.preventDefault();

        const cartao = link.closest(".project-card");

        if (!cartao) return;

        const imagem = cartao.querySelector(".project-image");

        if (!imagem) return;

        const itens = itensDoGrupo("projetos");

        const indice = itens.indexOf(imagem);

        if (indice !== -1) {

            abrirLightbox(indice, "projetos");

        }

    });

});


/* Navegação por teclado */
document.addEventListener("keydown", (evento) => {

    if (!lightbox.classList.contains("aberto")) return;

    switch (evento.key) {

        case "Escape":

            fecharLightbox();

            break;

        case "ArrowRight":

            proximaImagem();

            break;

        case "ArrowLeft":

            imagemAnterior();

            break;

    }

});



/* =========================================================
   ESCOLHA DO TAMANHO DA FOLHA (A4 — A0)

   Cada cartão de template QGIS (.qpt) tem um seletor
   de folha. Ao mudar o tamanho, o template é regenerado
   com a MESMA proporção que o QGIS usa ao redimensionar
   a página (escala dos itens por fator de área) e
   oferecido para download já no tamanho escolhido.
========================================================= */

/*
    Verifica se o ambiente suporta a técnica:

    - O ficheiro .qpt é lido com fetch, que só funciona
      quando a página é servida por http (em file:// os
      browsers bloqueiam a leitura de ficheiros locais).
    - É preciso criar Blobs: Blob + URL.createObjectURL.

    Se algo falhar, o seletor é escondido e o botão
    Baixar continua a funcionar com o ficheiro original.
*/

const folhaSuportada = (function () {

    return typeof window.fetch === "function" &&

           typeof window.Blob === "function" &&

           typeof URL.createObjectURL === "function";

})();


/*
    DICTIONÁRIO DE TAMANHOS DE FOLHA

    Fonte única dos tamanhos oferecidos no menu de download
    de cada template (botão "Baixar"). A ordem das chaves é
    a ordem em que aparecem no menu.

    id:      "larguraxaltura" em mm (orientação horizontal,
             a mesma que o QGIS usa ao guardar a página);
    nome:    nome curto mostrado no menu e usado no nome
             do ficheiro gerado;
    largura / altura: as dimensões em si — é assim que
             evitamos repetir os números duas vezes.

    Para acrescentar ou remover tamanhos, basta editar aqui:
    todos os templates herdam a lista automaticamente, sem
    precisar de tocar no HTML nem em mais nada.
*/

const DICIONARIO_FOLHAS = [

    { id: "297x210",   nome: "A4",  largura: 297,  altura: 210 },

    { id: "420x297",   nome: "A3",  largura: 420,  altura: 297 },

    { id: "594x420",   nome: "A2",  largura: 594,  altura: 420 },

    { id: "841x594",   nome: "A1",  largura: 841,  altura: 594 },

    { id: "1189x841",  nome: "A0",  largura: 1189, altura: 841 },

    { id: "1682x1189", nome: "2A0", largura: 1682, altura: 1189 }

];



/*
    Índice rápido "id → entrada", usado para descobrir o nome
    e as dimensões de um tamanho a partir da sua chave.
*/

const FOLHAS_POR_ID = {};

DICIONARIO_FOLHAS.forEach((folha) => {

    FOLHAS_POR_ID[folha.id] = folha;

});



/*
    NOMES_FOLHAS mantém-se como índice direto "id → nome"
    para o resto do código (rótulos e nomes de ficheiros).
*/

const NOMES_FOLHAS = {};

DICIONARIO_FOLHAS.forEach((folha) => {

    NOMES_FOLHAS[folha.id] = folha.nome;

});



/*
    Lista de chaves ("297x210", …) que cada template oferece
    quando o HTML não especifica a sua própria lista data-folhas.
    Por omissão: todos os tamanhos do dicionário, pela ordem.
*/

const FOLHAS_POR_OMISSAO = DICIONARIO_FOLHAS.map((folha) => folha.id);


/*
    Cache dos ficheiros .qpt já descarregados
    (evita repetir pedidos ao mudar de tamanho).
*/

const cacheQpt = {};


/*
    Descarrega o texto do .qpt original.
*/

async function lerQpt(caminho) {

    if (!cacheQpt[caminho]) {

        const resposta = await fetch(caminho);

        if (!resposta.ok) {

            throw new Error("HTTP " + resposta.status);

        }

        cacheQpt[caminho] = await resposta.text();

    }

    return cacheQpt[caminho];

}


/*
    Redimensiona o layout para a folha pedida:

    1. Descobre o tamanho ATUAL da página (item type 65638).
    2. size="L,A,mm" de todos os itens (incluindo a página)
       → multiplicados por √(área nova / área antiga),
         exatamente como o QGIS faz com "Resize to page".
    3. position / positionOnPage de todos os itens
       → mesma fração da folha (x/L, y/A).
    4. Nós de <node x= y=/> (linha de escala, moldura)
       → mesmo fator de área.
    5. A página recebe, no fim, o tamanho exato da folha.
*/

function redimensionarQpt(texto, larguraNova, alturaNova) {

    /* 1. Descobre o tamanho ATUAL da página (o item com

       type="65638"), sem depender da ordem dos atributos. */

    const tagPagina = texto.match(/<LayoutItem\b[^>]*\btype="65638"[^>]*>/);

    const medidaPagina =

        tagPagina && tagPagina[0].match(/\bsize="([\d.]+),([\d.]+),mm"/);



    if (!medidaPagina) {

        throw new Error("página não encontrada");

    }



    const pgLargura = parseFloat(medidaPagina[1]);

    const pgAltura = parseFloat(medidaPagina[2]);



    /* Fator de área: mesma proporção que o QGIS aplica

       ao redimensionar um layout para a página nova. */

    const fatorArea = Math.sqrt(

        (larguraNova * alturaNova) / (pgLargura * pgAltura)

    );



    return texto

        /* 2. Itens: fator de área (a página é corrigida no fim) */

        .replace(/\bsize="([\d.]+),([\d.]+),mm"/g, (m, l, a) =>

            'size="' + (l * fatorArea).toFixed(3) + ',' +

                       (a * fatorArea).toFixed(3) + ',mm"')



        /* 3. Posições: mesma fração da folha */

        .replace(/\b(position|positionOnPage)="(-?[\d.]+),(-?[\d.]+),mm"/g,

            (m, atributo, x, y) =>

                atributo + '="' + (x / pgLargura * larguraNova).toFixed(3) + ',' +

                           (y / pgAltura * alturaNova).toFixed(3) + ',mm"')



        /* 4. Nós de polilinhas (moldura, linha de escala) */

        .replace(/<node x="([\d.]+)" y="([\d.]+)"\/>/g, (m, x, y) =>

            '<node x="' + (x * fatorArea).toFixed(3) + '" y="' +

                        (y * fatorArea).toFixed(3) + '"/>')



        /* 4. A página é corrigida no FIM: o passo anterior

           escalou também o tamanho dela pelo fator de área. */

        .replace(/<LayoutItem\b[^>]*\btype="65638"[^>]*>/, (tag) =>

            tag.replace(/\bsize="[\d.]+,[\d.]+,mm"/,

                'size="' + larguraNova + "," + alturaNova + ',mm"'));

}


/*
    Nome seguro para o ficheiro gerado.
*/

function nomeSeguro(nome) {

    /* Mantém acentos e letras portuguesas: só troca os

       caracteres que não são seguros em nomes de ficheiro. */

    return nome.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, "_");

}


/*
    Aviso discreto quando o tamanho não pode ser gerado
    (normalmente por a página estar aberta a partir do
    disco, em file://, onde o fetch está bloqueado).
*/

function mostrarAvisoFolha(seletor) {

    const caixa = seletor.closest(".template-actions") || seletor.parentElement;



    if (!caixa || caixa.querySelector(".sheet-aviso")) return;



    const aviso = document.createElement("span");



    aviso.className = "sheet-aviso";



    aviso.textContent =

        "Para gerar outros tamanhos, abre o site com servidor local.";



    caixa.appendChild(aviso);

}


/*
    Constrói o menu de folhas dentro do botão Baixar:
    um <select> invisível (a fonte de verdade, lida por
    iniciarSeletoresFolha) e o botão de seta que o abre.
*/

function construirMenusFolha() {

    if (!folhaSuportada) return;



    const grupos = document.querySelectorAll(".baixar-wrap");



    function fecharGrupo(grupo) {

        const seta = grupo.querySelector(".baixar-toggle");

        const menu = grupo.querySelector(".baixar-menu");

        if (menu) menu.hidden = true;

        grupo.classList.remove("menu-aberto");

        if (seta) seta.setAttribute("aria-expanded", "false");

    }



    function fecharTodos(exceto) {

        grupos.forEach((grupo) => {

            if (grupo !== exceto) fecharGrupo(grupo);

        });

    }



    grupos.forEach((grupo) => {

        const link = grupo.querySelector(".baixar-template");
        const ficheiroBase = grupo.dataset.baseFile;
        let baseSize = grupo.dataset.baseSize;

        /*
            Tamanhos oferecidos: se o cartão tiver data-folhas,
            essa lista vence; senão, entram todos os tamanhos
            do dicionário.
        */
        const folhas = (grupo.dataset.folhas || "")
            .split(",").map((s) => s.trim()).filter(Boolean);

        const listaFolhas = folhas.length ? folhas : FOLHAS_POR_OMISSAO;



        if (!link || !ficheiroBase || !baseSize) return;

        /*
            Garante que o tamanho original do ficheiro está no
            dicionário: se data-base-size vier noutra escrita
            (ex.: "297.0x210"), identificamos a folha comparando
            as dimensões com uma pequena tolerância.
        */
        const medidasBase = String(baseSize).split("x")
            .map((valor) => parseFloat(valor));

        const folhaBase = DICIONARIO_FOLHAS.find((folha) =>
            Math.abs(folha.largura - medidasBase[0]) < 0.5 &&
            Math.abs(folha.altura - medidasBase[1]) < 0.5);

        if (folhaBase) {
            baseSize = folhaBase.id;
            grupo.dataset.baseSize = folhaBase.id;
        }



        /* Etiqueta com a folha atual, dentro do próprio botão */

        const etiqueta = document.createElement("span");

        etiqueta.className = "baixar-folha";

        etiqueta.textContent = NOMES_FOLHAS[baseSize] || baseSize;

        link.appendChild(etiqueta);



        /* Selector invisível: mantém a lógica de geração intacta */

        const seletor = document.createElement("select");

        seletor.className = "sheet-size-select";

        seletor.hidden = true;

        seletor.tabIndex = -1;

        seletor.setAttribute("aria-hidden", "true");

        seletor.dataset.baseFile = ficheiroBase;

        seletor.dataset.baseSize = baseSize;

        /*
            Se o cartão definir um nome próprio para o ficheiro
            descarregado, e/ou uma lista de ficheiros reais por
            folha, passamos essa informação para o seletor.
        */
        if (grupo.dataset.nome) seletor.dataset.nome = grupo.dataset.nome;

        if (grupo.dataset.ficheiros) seletor.dataset.ficheiros = grupo.dataset.ficheiros;

        listaFolhas.forEach((valor) => {

            const opcao = document.createElement("option");

            opcao.value = valor;

            opcao.textContent = NOMES_FOLHAS[valor] || valor;

            if (valor === baseSize) opcao.selected = true;

            seletor.appendChild(opcao);

        });

        grupo.appendChild(seletor);



        /* Seta que abre o menu */

        const seta = document.createElement("button");

        seta.type = "button";

        seta.className = "baixar-toggle";

        seta.setAttribute("aria-haspopup", "true");

        seta.setAttribute("aria-expanded", "false");

        seta.setAttribute("aria-label", "Escolher tamanho da folha");

        seta.innerHTML =

            '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" ' +

            'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" ' +

            'stroke-linejoin="round" aria-hidden="true">' +

            '<path d="M1 1l4 4 4-4"></path></svg>';



        /* Lista de tamanhos */

        const menu = document.createElement("div");

        menu.className = "baixar-menu";

        menu.setAttribute("role", "menu");

        menu.hidden = true;



        const titulo = document.createElement("span");

        titulo.className = "baixar-menu-titulo";

        titulo.textContent = "Tamanho da folha";

        menu.appendChild(titulo);



        const itens = [];



        listaFolhas.forEach((valor) => {

            const item = document.createElement("button");

            item.type = "button";

            item.className = "baixar-opcao";

            item.setAttribute("role", "menuitemradio");

            item.setAttribute("aria-checked", valor === baseSize ? "true" : "false");

            item.dataset.value = valor;

            const folha = FOLHAS_POR_ID[valor];

            item.innerHTML =
                "<span>" + (NOMES_FOLHAS[valor] || valor) + "</span>" +
                "<small>" + (folha ? folha.largura + " × " + folha.altura
                                   : valor.replace("x", " × ")) + " mm</small>";

            menu.appendChild(item);

            itens.push(item);

        });



        grupo.appendChild(seta);

        grupo.appendChild(menu);



        const fechar = () => fecharGrupo(grupo);



        function abrir() {

            fecharTodos(grupo);

            menu.hidden = false;

            grupo.classList.add("menu-aberto");

            seta.setAttribute("aria-expanded", "true");

        }



        seta.addEventListener("click", (evento) => {

            evento.stopPropagation();

            if (menu.hidden) abrir(); else fechar();

        });



        itens.forEach((item) => {

            item.addEventListener("click", (evento) => {

                evento.stopPropagation();

                const valor = item.dataset.value;

                itens.forEach((outro) => {

                    outro.setAttribute("aria-checked", outro === item ? "true" : "false");

                });

                seletor.value = valor;

                seletor.dispatchEvent(new Event("change"));

                /*
                   Não fechar imediatamente - deixar o clique outside
                   fechar o menu depois de um pequeno atraso, para
                   permitir que o clique no option seja processado.
                */

                setTimeout(() => {

                    fechar();

                }, 150);

            });

        });

    });



    document.addEventListener("click", (evento) => {

        if (!(evento.target instanceof Element) ||

            !evento.target.closest(".baixar-wrap")) {

            fecharTodos(null);

        }

    });



    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") fecharTodos(null);

    });

}


/*
    Ativa os seletores de folha.
*/

function iniciarSeletoresFolha() {

    /* Sem suporte, o botão Baixar continua a entregar o

       ficheiro original — apenas não se ativam os menus. */

    if (!folhaSuportada) return;



    document.querySelectorAll(".sheet-size-select").forEach((seletor) => {



        const cartao = seletor.closest(".template-card");

        if (!cartao) return;



        const botaoBaixar = cartao.querySelector(".baixar-template");

        const ficheiroBase = seletor.dataset.baseFile;



        if (!botaoBaixar || !ficheiroBase) return;



        seletor.addEventListener("change", async () => {



            const [l, a] = seletor.value.split("x");



            /* Etiqueta com a folha, dentro do botão */

            const rotuloFolha = botaoBaixar.querySelector(".baixar-folha");

            /* Nome próprio do ficheiro (opcional, definido no cartão) */

            const nomePersonalizado = seletor.dataset.nome;



            /*
                Ficheiros reais por folha.

                Alguns cartões (ex.: "plano urbano") já trazem um
                ficheiro .qpt pronto para cada tamanho. Nesse caso
                não há nada a gerar: descarrega-se o ficheiro que
                já existe na pasta.
            */

            const ficheiros = (function (bruto) {

                if (!bruto) return null;

                try {

                    return JSON.parse(bruto);

                } catch (erro) {

                    return null;

                }

            })(seletor.dataset.ficheiros);

            const ficheiroDaFolha = ficheiros && ficheiros[seletor.value];

            const nomeDaFolha = NOMES_FOLHAS[seletor.value] || seletor.value;



            /* 1. Há um ficheiro pronto para esta folha? Usa-o. */

            if (ficheiroDaFolha) {

                if (botaoBaixar._urlGerado) {

                    URL.revokeObjectURL(botaoBaixar._urlGerado);

                    botaoBaixar._urlGerado = null;

                }

                botaoBaixar.href = ficheiroDaFolha;

                botaoBaixar.download = nomePersonalizado

                    ? nomeSeguro(nomePersonalizado) + "_" + nomeDaFolha + ".qpt"

                    : ficheiroDaFolha.split("/").pop();

                if (rotuloFolha) rotuloFolha.textContent = nomeDaFolha;

                return;

            }



            /* 2. Se for o tamanho original do ficheiro, não há

               nada a gerar: mantém-se o download tal como está. */

            if (seletor.value === seletor.dataset.baseSize) {

                botaoBaixar.href = ficheiroBase;

                botaoBaixar.download = ficheiroBase.split("/").pop();

                if (rotuloFolha) {

                    rotuloFolha.textContent = NOMES_FOLHAS[seletor.value] || seletor.value;

                }

                return;

            }



            /* Muda só o rótulo: o ícone e a etiqueta da folha

               ficam intactos. */

            const textoBotao = botaoBaixar.querySelector(".baixar-texto");



            if (textoBotao) textoBotao.textContent = "A gerar…";



            try {



                const texto = await lerQpt(ficheiroBase);



                const novo = redimensionarQpt(texto, parseFloat(l), parseFloat(a));



                const blob = new Blob([novo], { type: "application/xml" });



                if (botaoBaixar._urlGerado) {

                    URL.revokeObjectURL(botaoBaixar._urlGerado);

                }



                botaoBaixar._urlGerado = URL.createObjectURL(blob);



                botaoBaixar.href = botaoBaixar._urlGerado;



                const base = nomePersonalizado ||

                    ficheiroBase.split("/").pop().replace(/\.qpt$/i, "");



                const nomeFolha = NOMES_FOLHAS[seletor.value] || seletor.value;



                botaoBaixar.download =

                    nomeSeguro(base) + "_" + nomeFolha + ".qpt";



                if (rotuloFolha) rotuloFolha.textContent = nomeFolha;



            } catch (erro) {



                /* Sem servidor (file://) ou ficheiro inválido:

                   volta ao original e explica o porquê. */                botaoBaixar.href = ficheiroBase;

                botaoBaixar.download = ficheiroBase.split("/").pop();

                seletor.value = seletor.dataset.baseSize;

                if (rotuloFolha) {

                    rotuloFolha.textContent =

                        NOMES_FOLHAS[seletor.dataset.baseSize] || seletor.dataset.baseSize;

                }

                mostrarAvisoFolha(seletor);



                console.warn("Não foi possível gerar este tamanho:", erro);



            } finally {



                /* Repõe o rótulo do botão */

                if (textoBotao) textoBotao.textContent = "Baixar";



            }



        });



    });

}


construirMenusFolha();



iniciarSeletoresFolha();

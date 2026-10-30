// The page in Brazilian Portuguese. The English lives in index.html; each key
// here is the data-i18n of an element there, and the value replaces that
// element's HTML. The js.* and doc.* keys are the texts the page's own script
// writes. A key missing here stays in English and is reported in the console,
// so a change to the English text must change its line here in the same commit.
//
// Tasmota's own interface is in English, so its menu names (Tools, Console,
// Configuration, Firmware Upgrade) and those of the installer's dialog
// (Update, Logs & Console, Disconnected) stay as the board and the dialog show
// them. The page's own buttons are translated.
window.I18N_PT = {
  "doc.description":
    "Grave o Tasmota em placas KinCony pelo navegador: 8 emissores infravermelhos na AG8, 32 canais na A16v3, ethernet nas duas.",

  // ---- Navigation and hero ----
  // The name in the top bar, "Tasmota KinCony", is the same in both languages.
  "nav.boards": "Placas",
  "nav.how": "Como funciona",
  "nav.faq": "Perguntas",
  "hero.title": "Tasmota na sua placa KinCony, direto do navegador",
  "hero.sub": `
          Ligue a placa com um cabo USB-C e clique em instalar. Sem Python, sem
          esptool, sem PlatformIO e sem compilação para montar: são os builds
          que o instalador oficial do Tasmota não tem, para placas que ele não
          cobre.`,
  "hero.pill.boards": "2 placas",
  "hero.pill.wifi": "Wi-Fi configurado no navegador",
  "hero.pill.gpl": "Firmware GPL-3.0, código público",
  "hero.cta.choose": "Escolha a placa",
  "hero.cta.why": "Por que não o instalador oficial",

  // ---- Why this exists ----
  "why.eyebrow": "Por que isto existe",
  "why.title": "Os binários publicados não servem para estas placas",
  "why.lead": `
            Cada uma destas três lacunas basta para deixar uma placa meio
            morta, e duas delas falham sem uma única mensagem de erro.`,
  "why.ir.title": "O driver de IR completo",
  "why.ir.text": `
              O build padrão do ESP32-S3 traz o driver básico, que não escolhe
              emissor: os oito bornes se comportam como um só. O preset de IR
              tem o driver completo, mas corta 97 recursos para caber num chip
              de 4 MB, entre eles o SPI, e com ele a ethernet.`,
  "why.pcf.title": "Os expansores PCF8574",
  "why.pcf.text": `
              Os 16 relés e as 16 entradas da A16v3 ficam atrás de expansores
              I2C, e esse driver está comentado em todos os builds oficiais. A
              placa liga sem nada para acionar.`,
  "why.eth.title": "Ethernet sem cabo USB",
  "why.eth.text": `
              O W5500 das duas placas divide dois pinos com o console serial.
              Sem um computador no USB, o console toma esses pinos e o link
              nunca sobe. A correção está nestes builds e foi aceita no projeto
              oficial.`,

  // ---- Boards ----
  "boards.eyebrow": "Instalar",
  "boards.title": "Escolha a sua placa",
  "boards.lead": `
            Chrome ou Edge num computador. O Web Serial, de que o instalador
            precisa, não existe no Firefox, no Safari, no Android nem no iOS.`,
  "chip.eth": "Ethernet W5500",
  "install.unsupported": "Use o Chrome ou o Edge num computador para gravar.",
  "install.notAllowed": "O Web Serial precisa de HTTPS ou localhost.",
  "steps.where": `
                  Todo comando abaixo vai na página da própria placa:
                  <strong>Tools → Console</strong>. Cole e tecle Enter.`,

  // Steps both boards share.
  "step.wifi": `<strong>Wi-Fi.</strong> Logo depois de gravar, o instalador
                    pede a sua rede: preencha e este passo acabou.`,
  "step.wifi.why": `
                      <li>
                        Pulou essa tela? Sem Wi-Fi salvo, a placa abre uma rede
                        própria, <code>tasmota-XXXX</code>. Entre nela pelo
                        celular ou pelo notebook, abra
                        <code>http://192.168.4.1</code> e informe o seu Wi-Fi
                        ali.
                      </li>
                      <li>
                        O instalador mostra <strong>Disconnected</strong>? É a
                        placa reiniciando: o Tasmota reinicia para entrar na
                        rede assim que recebe o Wi-Fi, e nestas placas o USB sai
                        direto do ESP32-S3, então cada reinício faz a porta
                        sumir do navegador. O Wi-Fi já está salvo. Feche a
                        janela, espere 20 segundos e procure a placa no roteador
                        ou no Home Assistant.
                      </li>`,
  "step.template": `<strong>Template.</strong> Mande este primeiro e depois o
                    <code>Module 0</code> como um segundo comando. A placa
                    reinicia depois do <code>Module 0</code>.`,
  "step.eth": `<strong>Ethernet.</strong> <code>8</code> é o chip W5500 desta
                    placa. Ela reinicia sozinha, e depois disso o cabo funciona
                    sem USB.`,
  "step.protect": `<strong>Proteção e relógio.</strong> Uma linha, três
                    ajustes:`,
  "step.protect.why": `
                      <li><code>SetOption65 1</code>: sete quedas de energia seguidas não apagam mais todas as configurações.</li>
                      <li><code>SetOption36 0</code>: cinco ou seis reinícios rápidos não apagam mais o template e o módulo.</li>
                      <li><code>Timezone -3</code>: horário de Brasília. O Tasmota vem em UTC+1; use o seu fuso no lugar do <code>-3</code>.</li>`,

  // ---- AG8 ----
  "ag8.tagline": "Hub de infravermelho, ESP32-S3",
  "ag8.chip.emitters": "8 emissores IR",
  "ag8.chip.receiver": "receptor IR",
  "ag8.chip.ac": "ar-condicionado",
  "ag8.chip.serial": "RS485 e RS232",
  "ag8.chip.modbus": "Modbus e ponte TCP",
  "ag8.lead": `
                Um comando escolhe por qual dos oito emissores o sinal sai, e
                os quadros de ar-condicionado são montados pelo firmware a
                partir de fabricante, modo, temperatura, ventilação e aleta.`,
  "ag8.status": "Em uso aqui desde setembro de 2026, ethernet sem cabo USB",
  "ag8.install": "Instalar na AG8",
  "ag8.steps": "Depois de gravar, seis passos",
  "ag8.step.ir": `<strong>Aprender qualquer controle.</strong> Sem isto, um
                    controle cujo protocolo o Tasmota não conhece é ignorado;
                    com isto, os tempos crus chegam e podem ser aprendidos.`,
  "ag8.step.ha": `
                    <strong>Home Assistant.</strong> Instale o
                    <a href="https://github.com/self-labs/tasmota-ir">Tasmota IR</a>
                    pelo HACS: as teclas aprendidas viram botões, e os aparelhos de ar-condicionado viram entidades <code>climate</code>.`,
  "ag8.foot": `
                  O lado infravermelho desta placa fica com o
                  <a href="https://github.com/self-labs/tasmota-ir">Tasmota IR</a>,
                  que tem documentação própria.`,

  // ---- A16v3 ----
  "a16.tagline": "16 relés, ESP32-S3",
  "a16.chip.relays": "16 relés",
  "a16.chip.inputs": "16 entradas",
  "a16.chip.analog": "4 entradas analógicas",
  "a16.chip.clock": "relógio DS3231",
  "a16.chip.display": "display SSD1306",
  "a16.lead": `
                O driver PCF8574 para os 32 canais, que nenhum build oficial
                traz, junto com o relógio, o display e as pontes.`,
  "a16.status": "Em uso aqui desde setembro de 2026: 16 relés, 16 entradas, ethernet sem cabo USB",
  "a16.install": "Instalar na A16v3",
  "a16.steps": "Depois de gravar, sete passos",
  "a16.step.template.why": `
                      <li>O template já põe uma fita de LED WS2812 no <code>GPIO41</code>, pino 3 do conector <code>P12</code> ao lado do ESP32-S3 (<code>39 40 41 GND 3V3</code>). Sem fita ligada ali, a luz que ele cria simplesmente não acende nada.</li>
                      <li>O display fica desligado de propósito. Ligá-lo exige uma marca <em>Option A3</em> no template, e aí o display ocupa um power próprio: depois dos 16 relés ele vira o power 17, a luz da fita passa para o 18 e para de responder no Home Assistant. Numa placa sem a fita, marque o <code>GPIO45</code> como <code>6210</code> e o display liga.</li>`,
  "a16.step.files": `<strong>Os dois arquivos.</strong> Baixe o
                    <a href="files/pcf8574.dat" download><code>pcf8574.dat</code></a>
                    e o
                    <a href="files/display.ini" download><code>display.ini</code></a>,
                    envie os dois em <strong>Tools → Manage File system</strong>
                    e reinicie:`,
  "a16.step.inputs": `<strong>Entradas.</strong> Cada entrada inverte o relé de
                    mesmo número, na própria placa, e as 16 aparecem no Home
                    Assistant ao lado dos relés. Uma linha de ajustes, depois
                    cada regra numa linha só dela, e depois uma linha que liga
                    as duas regras:`,
  "a16.step.inputs.why": `
                      <li><code>SetOption114 1</code>: a entrada não aciona mais o relé sozinha. Cada mudança continua chegando às regras e sai na hora, e o Tasmota anuncia as entradas, então o Home Assistant as cria como sensores binários.</li>
                      <li><code>SwitchMode0 2</code>: contato fechado é ligado e aberto é desligado. Uma regra sem valor, como <code>Switch1#State</code>, atende os dois, então cada virada da tecla de parede inverte o relé, e a posição da tecla nunca precisa bater com o relé quando o Home Assistant também o aciona. No modo 0, o Home Assistant só ofereceria as entradas como gatilhos de automação.</li>
                      <li>As regras moram na placa e rodam nela, sem Home Assistant e sem rede, e nada inverte sozinho no boot: as entradas são lidas como estão quando o Tasmota inicia e ignoradas nos primeiros 4 segundos. Mande cada regra numa linha só dela, nunca dentro de um <code>Backlog</code>, que separa os comandos pelo <code>;</code>. Elas ocupam 319 e 333 dos 511 caracteres que cabem numa regra, e a <code>Rule3</code> fica livre para o que mais a casa precisar.</li>
                      <li>Por canal, troque o pedaço daquela entrada e mande a regra inteira de novo: outro relé é outro número depois do <code>Power</code>; um pulsador, o botão que volta sozinho, continua no modo 2 e usa <code>Switch3#State=1</code>, o aperto; uma entrada que só informa o Home Assistant, ou uma livre, sai da regra. <code>PulseTime13 5</code> desliga o relé 13 sozinho depois de 0,5 s: de 1 a 111 são décimos de segundo, acima disso são segundos mais 100, e <code>0</code> tira o pulso.</li>`,
  "a16.step.names": `
                      <strong>Opcional: nomes das entradas.</strong> O Home
                      Assistant mostra as entradas como <code>Switch1</code> a
                      <code>Switch16</code>. Para ver <code>IN1</code> a
                      <code>IN16</code>, mande isto antes de a placa entrar no
                      Home Assistant, porque o ID da entidade nasce do primeiro
                      nome. As regras continuam chamando as entradas de
                      <code>Switch1</code> a <code>Switch16</code>:`,
  "a16.step.relaynames": `
                      <strong>Opcional: nomes dos relés.</strong> O Home
                      Assistant pega os nomes dos relés do Tasmota, que vem com
                      <code>Tasmota</code>, <code>Tasmota2</code> e assim por
                      diante, e guarda só 8. A primeira linha chama os relés 1 a 8
                      de <code>OUT1</code> a <code>OUT8</code>; mande antes de a
                      placa entrar no Home Assistant, como os nomes das entradas.
                      Os relés 9 a 16 chegam como <code>switch 9</code> a
                      <code>switch 16</code>, e a fita como
                      <code>light 17</code>: renomeie esses no próprio Home
                      Assistant. A segunda linha põe <code>OUT1</code> a
                      <code>OUT16</code> nos botões dos relés da página da placa,
                      e não chega ao Home Assistant:`,
  "a16.step.variant": `
                      <strong>Variante: sem regras.</strong> O próprio Tasmota
                      liga cada entrada ao seu relé, e o Home Assistant mostra só
                      os relés:`,
  "a16.step.variant.why": `
                      <li><code>SetOption114 0</code>: a entrada 1 aciona o relé 1, e assim até a 16, na própria placa, e o Tasmota deixa de anunciar as entradas. <code>SwitchMode0 0</code> é para interruptores; <code>SwitchMode1 3</code> põe um pulsador na entrada 1.</li>
                      <li><code>Rule1 0; Rule2 0</code>: as duas regras ficam desligadas, não apagadas.</li>
                      <li>Trocar entre as duas remove ou recria os 16 sensores de entrada no Home Assistant, junto com qualquer área ou nome dado a eles lá.</li>`,
  "a16.step.strip": `<strong>Fita de LED.</strong> Só com uma fita no
                    <code>GPIO41</code>. Uma linha, dois ajustes:`,
  "a16.step.strip.why": `
                      <li><code>Pixels 7</code>: quantos LEDs a fita tem. O Tasmota começa em 30; ponha a sua contagem.</li>
                      <li><code>Dimmer 30</code>: brilho em 30%. A fita puxa dos 5 V da placa, o mesmo trilho do ESP32, então mantenha baixo até medir esses 5 V com a fita acesa.</li>`,
  "a16.foot": `
                  Os dois arquivos vêm deste repositório. O <code>pcf8574.dat</code>
                  transforma os 32 pinos dos expansores em relés e entradas; o
                  <code>display.ini</code> descreve o SSD1306 e só é lido numa
                  placa que liga o display (passo 2).`,

  // ---- Find a board ----
  "find.eyebrow": "Já gravada",
  "find.title": "Ache a placa na sua rede",
  "find.lead": `
            Ligue a placa pelo USB e deixe esta página perguntar a ela. Ela
            responde com os endereços do Wi-Fi e do cabo; nada é gravado na
            placa.`,
  "find.button": "Achar minha placa",
  "find.restart": "Reiniciar pelo USB e perguntar de novo",
  "find.cable": "Cabo",
  "find.note": `
            Feche antes a janela do instalador: só uma página pode usar a
            porta. Uma placa que já estava ligada nos 12 V antes de o USB entrar
            não responde pelo USB; o segundo botão a reinicia para que responda,
            e os relés voltam como estavam.`,

  // ---- Backup ----
  "backup.title": "Faça o backup da placa antes",
  "backup.p1": `
              Instalar grava a <strong>imagem de fábrica</strong> no endereço 0:
              bootloader, tabela de partições, aplicação e safeboot. Numa placa
              vinda de outro firmware, o instalador pergunta antes se deve
              apagar a flash, e a caixa vem desmarcada.
              <strong>Vindo do KCS, marque</strong>: é isso que faz a placa
              iniciar limpa, e também apaga o KCS com tudo o que foi
              configurado e aprendido nele.`,
  "backup.p2": `
              <strong>O firmware KCS em si não se perde.</strong> A KinCony
              publica um por placa no
              <a href="https://www.kincony.com/forum/forumdisplay.php?fid=75">fórum</a>
              dela, e o arquivo dentro do zip é uma imagem completa, com
              bootloader e tabela de partições, então ele volta no endereço 0 do
              mesmo jeito. O que nenhum download devolve é o que a placa
              guardava: as configurações, as cenas e os códigos IR aprendidos
              nos slots do KCS. Um navegador não consegue ler a flash, e é para
              isso que serve o backup.`,
  "backup.p3": `
              O arquivo tem que ter exatamente 16.777.216 bytes, e
              <code>write_flash 0x0 backup-16MB.bin</code> devolve a placa do
              jeito que veio, com as configurações e os códigos aprendidos.`,

  // ---- How it works ----
  "how.eyebrow": "Como funciona",
  "how.title": "Três minutos, do começo ao fim",
  "how.plug.title": "Ligue a placa",
  "how.plug.text": `
              USB-C, com um cabo que passe dados. Se a placa não aparecer na
              lista, segure o <strong>DW</strong>, toque no <strong>RST</strong>,
              solte o <strong>DW</strong> e tente de novo.`,
  "how.install.title": "Clique em instalar",
  "how.install.text": `
              O navegador grava a imagem de fábrica direto desta página,
              perguntando antes se deve apagar a flash. Nada é instalado no seu
              computador.`,
  "how.wifi.title": "Entre no seu Wi-Fi",
  "how.wifi.text": `
              O instalador oferece configurar o Wi-Fi pelo mesmo cabo. Daí em
              diante a placa tem a própria interface web, e o Home Assistant a
              encontra pelo MQTT.`,

  // ---- Where the firmware comes from ----
  "source.eyebrow": "De onde vem o firmware",
  "source.title": "Tasmota, mais dois ambientes",
  "source.lead": `
            Os dois builds saem do
            <a href="https://github.com/cateim/Tasmota/tree/tasmota-kincony">cateim/Tasmota</a>,
            branch <code>tasmota-kincony</code>: o próprio Tasmota com um
            ambiente por placa. Cada push ali compila os dois e publica uma
            release, e esta página serve os binários da mais recente.`,
  "source.tasmota.title": "Atualizar o Tasmota",
  "source.tasmota.text": `
              Junte a release oficial nessa branch e faça o push. Só dois
              arquivos carregam as mudanças, então a atualização é só isso, e o
              site pega o resultado em até um dia.`,
  "source.board.title": "Atualizar uma placa",
  "source.board.text": `
              A página reconhece uma placa que já roda um destes builds, pelo
              nome que ela anuncia (<code>Tasmota AG8</code>,
              <code>Tasmota A16v3</code>), e oferece <strong>Update</strong>,
              gravado sem apagar, e as configurações ficam: testado na A16v3.
              Fazer antes o backup da configuração (Configuration, Backup)
              continua não custando nada. Enviar o <code>.bin</code> simples em
              Firmware Upgrade, na interface web da própria placa, faz o mesmo a
              partir dela.`,
  "source.read.title": "Ler o código",
  "source.read.text": `
              O Tasmota é GPL-3.0 e a branch é pública: ela é o código completo
              do que esta página grava na sua placa.`,

  // ---- FAQ ----
  "faq.eyebrow": "Perguntas",
  "faq.title": "Antes de clicar",
  "faq.kcs.q": "Dá para voltar ao firmware da KinCony?",
  "faq.kcs.a": `
              Dá, e você não precisa do backup para o firmware em si. A KinCony
              publica o KCS por placa no
              <a href="https://www.kincony.com/forum/forumdisplay.php?fid=75">fórum</a>
              dela, de graça e sem conta, como um zip por placa
              (<code>KCS_AG8_*.bin</code>, <code>KCS_A16V3_*.bin</code>). Cada
              um é uma imagem completa, com bootloader e tabela de partições,
              então <code>write_flash 0x0</code> com o arquivo do zip devolve a
              placa ao KCS. Só que a placa volta vazia: as configurações, as
              cenas e os códigos IR aprendidos nos slots do KCS moram no
              armazenamento da própria placa, e só o backup feito antes da
              gravação traz isso de volta.`,
  "faq.phone.q": "Funciona pelo celular ou pelo tablet?",
  "faq.phone.a": `
              Não. Gravar precisa do Web Serial, que só o Chrome e o Edge de
              computador têm. Depois de gravada, a interface web da placa e o
              Home Assistant funcionam em qualquer navegador.`,
  "faq.settings.q": "As minhas configurações ficam quando gravo por aqui?",
  "faq.settings.a": `
              Numa placa que já roda um destes builds, sim: ela recebe a opção
              Update, gravada sem apagar, e as configurações ficam, como
              testado na A16v3. Qualquer outra, o KCS incluído, recebe uma
              instalação nova, e o instalador pergunta antes se deve apagar;
              vindo do KCS, marque. Nos dois casos, um backup da configuração
              (Configuration, Backup) leva um segundo e devolve tudo de uma vez.`,
  "faq.where.q": "Onde está a minha placa na rede?",
  "faq.where.a": `
              O <a href="#find">Achar minha placa</a>, nesta página, pergunta a
              ela pelo USB e mostra os dois endereços. À mão, aperte
              <strong>Instalar</strong> no card da placa, escolha a porta, abra
              <strong>Logs &amp; Console</strong>, digite <code>Status 5</code>
              e tecle Enter. Na resposta, o <code>IPAddress</code> é o endereço
              do Wi-Fi e o que está dentro de <code>"Ethernet"</code> é o do
              cabo; <code>0.0.0.0</code> quer dizer que aquele lado não está
              conectado. A placa só escuta pelo USB quando o cabo já estava
              ligado na hora em que ela iniciou: se ela foi alimentada pelos
              12 V antes, o log diz <code>no SOF packet detected on USB
              port</code>. Reinicie com o USB ligado, pelo botão de reset ou
              cortando a energia, e pergunte de novo.`,
  "faq.sha.q": "O log serial diz \"SHA-256 comparison failed\". Quebrou?",
  "faq.sha.a": `
              Não. As linhas logo depois dizem <code>Attempting to boot
              anyway...</code>, e a placa inicia. A ROM do chip confere um
              SHA-256 guardado no fim do bootloader antes de iniciá-lo, e sem
              secure boot uma diferença é só um aviso. Builds de antes de 24 de
              setembro de 2026 gravavam um bootloader que declarava 4 MB de
              flash; no primeiro boot o Tasmota corrige esse byte para os 16 MB
              reais (<code>resize_max_flash_size_k</code> em
              <code>partition_core.be</code>) e deixa o hash como estava, então
              a ROM imprime isso em todo boot dali em diante. O hash
              <em>Expected</em> do log é o do cabeçalho de 4 MB, e o
              <em>Calculated</em> é o mesmo bootloader com 16 MB. Os builds
              atuais declaram 16 MB desde o início, com o hash certo, então uma
              placa instalada ou atualizada por esta página para de mostrar a
              mensagem. Uma atualização pela rede troca só a aplicação e mantém
              o bootloader antigo, e a mensagem com ele, o que é inofensivo.`,
  "faq.home.q": "A placa manda dados para fora?",
  "faq.home.a": `
              Não. O Tasmota conversa com o seu broker MQTT e com o que você
              apontar para ele. O endereço de atualização pela rede fica vazio
              de propósito nestes builds, para que uma atualização acidental
              não os troque por um firmware sem os drivers de que estas placas
              precisam.`,

  // ---- Footer ----
  "foot.license": `
            Firmware: Tasmota, GPL-3.0, compilado a partir do
            <a href="https://github.com/cateim/Tasmota/tree/tasmota-kincony">cateim/Tasmota</a>.
            <br/>
            Esta página: MIT,
            <a href="https://github.com/self-labs/tasmota-kincony">self-labs/tasmota-kincony</a>.`,
  "foot.credits": `
            Feito com o
            <a href="https://esphome.github.io/esp-web-tools/">ESP Web Tools</a>.
            Infravermelho no Home Assistant pelo
            <a href="https://github.com/self-labs/tasmota-ir">tasmota-ir</a>.
            Sem vínculo com a KinCony nem com o projeto Tasmota.`,

  // ---- Written by the page's script ----
  "js.needsDesktop": "Isto precisa do Chrome ou do Edge num computador.",
  "js.notConnected": "não conectado",
  "js.found": "Achei. Os endereços abrem a página da própria placa.",
  "js.noNetwork":
    "A placa respondeu, mas ainda não está em nenhuma rede. Digite WifiConfig 2 no console do instalador para ela abrir o Wi-Fi próprio por 3 minutos.",
  "js.busy":
    "A porta está ocupada. Feche a janela do instalador, ou outra página que esteja usando a porta, e tente de novo.",
  "js.asking": "Perguntando à placa...",
  "js.noAnswer":
    "Sem resposta. A placa provavelmente iniciou antes de o USB entrar, e aí ela não escuta pelo USB.",
  "js.restarting": "Reiniciando a placa...",
  "js.waitingBack": "Esperando a placa voltar...",
  "js.notBack":
    "A placa não voltou no USB. Tire o USB, ligue de novo e aperte Achar minha placa outra vez.",
  "js.waitingNet": "Esperando a rede dela...",
  "js.stillNoAnswer":
    "Ainda sem resposta. Abra o Logs & Console do instalador para ver o que a placa está dizendo.",
  "js.copy": "Copiar",
  "js.copied": "Copiado",
  "js.selectCopy": "Selecione e copie",
  "js.versionUnknown": "versão do firmware desconhecida",
};

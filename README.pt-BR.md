<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/icon-dark.svg">
    <img src="./assets/icon.svg" width="128" alt="Tasmota KinCony">
  </picture>
</p>

# ⚡ Tasmota KinCony

[English](./README.md) | **Português (Brasil)**

Um gravador pela web para os builds do Tasmota feitos para placas KinCony. Abra
a página no Chrome ou no Edge, ligue a placa pelo USB-C e clique em
**Instalar**: sem Python, sem esptool, sem PlatformIO.

**[self-labs.github.io/tasmota-kincony](https://self-labs.github.io/tasmota-kincony/)**

A página abre em português quando o navegador está em português (pt-BR ou
pt-PT), e o seletor EN | PT no topo troca e guarda a escolha.

## Por que não o instalador oficial do Tasmota

Os binários oficiais não servem para estas placas:

- **KinCony AG8.** O build padrão `tasmota32s3` traz o driver de IR básico, que
  não escolhe entre os 8 emissores. O preset `tasmota32-ir` tem o driver
  completo, mas corta 97 recursos para caber num ESP32 de 4 MB, entre eles o
  SPI, e com ele a ethernet W5500. Este build é o `tasmota32s3` completo mais o
  driver de IR completo.
- **KinCony KC868-A16v3.** Os 16 relés e as 16 entradas ficam atrás de
  expansores PCF8574, e o `USE_PCF8574` está desligado em todos os builds
  oficiais, então a placa liga sem nada para acionar.

Os dois builds também trazem uma correção que o Tasmota oficial só ganha na
versão seguinte à 15.6.0 ([arendst/Tasmota#25047](https://github.com/arendst/Tasmota/pull/25047)):
sem ela, a ethernet W5500 destas placas só sobe com um cabo USB ligado.

## Placas

| Placa               | Build               | Situação                                                     |
| ------------------- | ------------------- | ------------------------------------------------------------ |
| KinCony AG8         | `tasmota32s3-ag8`   | em uso: 8 emissores, receptor, ethernet sem USB              |
| KinCony KC868-A16v3 | `tasmota32s3-a16v3` | em uso: 16 relés, 16 entradas, fita de LED, ethernet sem USB |

## Antes de gravar

- **Chrome ou Edge num computador.** A gravação usa o Web Serial, que o
  Firefox, o Safari, o Android e o iOS não têm.
- **Faça o backup da placa.** Apagar a flash, o que o instalador oferece e uma
  placa vinda do KCS precisa, limpa a flash inteira, e o navegador não consegue
  lê-la de volta. O firmware KCS em si é publicado por placa no
  [fórum da KinCony](https://www.kincony.com/forum/forumdisplay.php?fid=75), e
  o arquivo dentro do zip é uma imagem completa que volta no endereço 0, então
  uma placa nunca fica perdida. O que nenhum download devolve é o que a placa
  guardava: as configurações, as cenas e os códigos IR aprendidos nos slots do
  KCS. Faça antes o backup de 16 MB com o esptool; a página tem o comando
  exato.

## Instalar

1. Abra [a página](https://self-labs.github.io/tasmota-kincony/) e ligue a
   placa pelo USB-C.
2. Clique em **Instalar** no card da placa e escolha a porta dela. Não aparece
   na lista? Ponha a placa em modo de gravação: segure o **DW**, toque no
   **RST**, solte o **DW**.
3. Vindo do KCS, marque **Erase device** quando o instalador perguntar. Uma
   placa que já roda um destes builds recebe a opção **Update**, que mantém as
   configurações.
4. Quando o instalador pedir o Wi-Fi, preencha. A placa reinicia para entrar na
   rede, e o instalador mostra **Disconnected**: é o esperado, veja
   [Problemas comuns](#problemas-comuns).
5. Siga os passos de depois da gravação no card da placa, descritos
   [abaixo](#configurar-a-placa-depois-de-gravar).

## O que o Install e o Update gravam

**O botão de instalar grava a imagem de fábrica** no endereço 0: bootloader,
tabela de partições, aplicação e safeboot. O que acontece antes disso depende
da placa.

- **Uma placa que já roda um destes builds** é reconhecida. Ela se anuncia pelo
  Improv como `Tasmota AG8` ou `Tasmota A16v3` (o `CODE_IMAGE_STR` do build
  dela), cada manifesto traz esse nome em `improv_firmware`, e a página entrega
  ao ESP Web Tools um `checkSameFirmware` que compara os dois, mantendo o
  `name` descritivo. A página oferece **Update**, gravado sem apagar, e as
  configurações ficam: testado na A16v3 com `kincony-20260924-97ba55c`. Um
  backup da configuração antes (Configuration, Backup) continua não custando
  nada.
- **A tabela de partições importa.** No primeiro boot com configurações novas,
  o Tasmota estende o sistema de arquivos até o fim da flash e reescreve a
  tabela (`resize_fs_to_max`, chamado em `xdrv_52_7_berry_embedded.ino` quando
  o contador de boots é 0). As imagens já trazem essa tabela de 16 MB, então
  gravar de novo não encolhe o sistema de arquivos onde moram as
  configurações.
- **Por que sempre Update.** O ESP Web Tools pula a instalação quando a versão
  que a placa informa é igual à `version` do manifesto, e a placa informa só a
  versão do Tasmota, a mesma para todos os builds da casa daquele Tasmota.
  Por isso a `version` do manifesto é a tag da release, que nunca bate, e uma
  correção de um build da casa sempre é oferecida; a versão do Tasmota fica
  num campo `tasmota`, que o rodapé mostra. O custo é que a página não
  consegue dizer que uma placa está em dia.
- **Qualquer outra placa** recebe **Install**, e o instalador pergunta antes se
  deve apagar a flash, com a caixa desmarcada. Vindo do KCS, marque.

Enviar o `.bin` simples da release em **Firmware Upgrade**, na interface web da
própria placa, atualiza a placa sem o site; ele troca a aplicação e nada mais.

## Configurar a placa depois de gravar

Cada card da página lista os seus passos, com um bloco para copiar por
comando, todos digitados na página da própria placa em **Tools → Console**.

**KinCony AG8**, seis passos:

| Passo                      | O que mandar                                                     |
| -------------------------- | ---------------------------------------------------------------- |
| Wi-Fi                      | a própria tela do instalador, logo depois de gravar              |
| Template                   | o `Template {...}` do card, e depois o `Module 0` sozinho        |
| Ethernet                   | `EthType 8`                                                      |
| Aprender qualquer controle | `SetOption58 1`                                                  |
| Proteção e relógio         | `Backlog SetOption65 1; SetOption36 0; Timezone -3`              |
| Home Assistant             | [Tasmota IR](https://github.com/self-labs/tasmota-ir), pelo HACS |

**KinCony KC868-A16v3**, sete passos:

| Passo              | O que mandar                                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Wi-Fi              | a própria tela do instalador, logo depois de gravar                                                                           |
| Template           | o `Template {...}` do card, e depois o `Module 0` sozinho                                                                     |
| Ethernet           | `EthType 8`                                                                                                                   |
| Os dois arquivos   | `pcf8574.dat` e `display.ini` em **Tools → Manage File system**, e depois `Restart 1`                                         |
| Entradas           | `Backlog SetOption114 1; SwitchMode0 2`, depois a `Rule1` e a `Rule2` do card, cada uma sozinha, e `Backlog Rule1 1; Rule2 1` |
| Proteção e relógio | `Backlog SetOption65 1; SetOption36 0; Timezone -3`                                                                           |
| Fita de LED        | `Backlog Pixels 7; Dimmer 30`, só com uma fita ligada                                                                         |

### Para que serve cada um

- **`Module 0`** vai como um segundo comando porque o template só vale depois
  que o módulo aponta para ele. A placa reinicia em seguida.
- **`EthType 8`** é o chip W5500 das duas placas.
- **`SetOption58 1`** deixa a AG8 aprender controles cujo protocolo a biblioteca
  não conhece: os tempos crus chegam, em vez de nada.
- **`SetOption65 1`**: sete quedas de energia seguidas apagam todas as
  configurações (`QPC_COUNT = 7` em `settings.ino`). Uma placa num quadro
  elétrico passa por isso numa tarde ruim.
- **`SetOption36 0`**: a proteção contra boot em loop apaga o template de GPIO
  depois de cinco reinícios rápidos e reseta o módulo depois de seis
  (`tasmota.ino`). Estas placas voltam disso sem relés e sem ethernet.
- **`Timezone`**: o Tasmota vem em UTC+1 (`APP_TIMEZONE 1`). `-3` é o horário
  de Brasília; use o seu fuso.
- **As entradas: uma linha de ajustes e depois duas regras.** O passo
  Entradas manda `Backlog SetOption114 1; SwitchMode0 2`, depois a `Rule1`
  com `ON Switch1#State DO Power1 TOGGLE ENDON` e assim até a entrada 8, a
  `Rule2` com as entradas 9 a 16, cada regra numa linha só dela, nunca dentro
  de um `Backlog`, e `Backlog Rule1 1; Rule2 1`. Cada entrada inverte o relé
  de mesmo número, na própria placa, então a tecla de parede funciona sem Home
  Assistant e sem rede, e as 16 entradas aparecem no Home Assistant ao lado
  dos relés. As regras ocupam 319 e 333 dos 511 caracteres que cabem numa
  regra, e a `Rule3` fica livre.
- **Por que funciona**, lido no código do firmware: com o `SetOption114 1` a
  entrada nunca aciona o relé sozinha, mas cada mudança continua chegando às
  regras pelo `SendKey` e é publicada na hora (`SwitchHandler` em
  `support_switch_v4.ino`), e o Tasmota só anuncia as entradas com o
  `SetOption114 1` (`xdrv_12_discovery.ino`). No `SwitchMode 2` o contato
  fechado manda `1` e o aberto `0`, e uma regra sem valor (`Switch1#State`)
  atende os dois, então cada virada inverte o relé: a posição da tecla nunca
  precisa bater com o relé quando o Home Assistant também o aciona. O modo 2 é
  também o que faz a integração criar sensores binários; no modo 0 ela só
  oferece gatilhos de automação. Nada deve inverter no boot, porque as
  entradas são lidas como estão quando o Tasmota inicia (`Pcf8574AddSwitch` em
  `xdrv_28_pcf8574_v2.ino`) e ignoradas nos primeiros 4 segundos. Conferido em
  25/10/2026 nas duas placas de um restaurante, tecla por tecla: cada virada
  inverte o relé dela, e a entrada muda no Home Assistant na hora.
- **Por canal**, troque o pedaço daquela entrada e mande a regra inteira de
  novo: outro relé é outro número depois do `Power`; um pulsador, o botão que
  volta sozinho, continua no modo 2 e usa `Switch3#State=1`, o aperto; uma
  entrada que só informa o Home Assistant, ou uma livre, sai da regra.
  `PulseTime<n>` desliga o relé `n` sozinho depois de um tempo: de 1 a 111 são
  décimos de segundo, acima disso são segundos mais 100, e `0` tira o pulso
  (`SetPulseTimer` em `support_tasmota.ino`). Quatro relés dando pulso de meio
  segundo, para portão, fechadura ou relé de impulso:
  `Backlog PulseTime13 5; PulseTime14 5; PulseTime15 5; PulseTime16 5`.
- **Nomes, se quiser**: `Backlog SwitchText1 IN1; SwitchText2 IN2; ...` até
  16 mostra as entradas como `IN1` a `IN16` no Home Assistant, em vez de
  `Switch1` a `Switch16`. Mande antes de a placa entrar no Home Assistant,
  porque o ID da entidade nasce do primeiro nome. As regras continuam
  chamando as entradas de `Switch1` a `Switch16`.
- **Nomes dos relés, se quiser**: `Backlog FriendlyName1 OUT1; ...` até 8 chama
  os relés 1 a 8 de `OUT1` a `OUT8` no Home Assistant, mandado antes de a placa
  entrar nele, como os nomes das entradas. O Tasmota guarda só 8 nomes de relé
  (`FriendlyName9` responde `Command Error`), então os relés 9 a 16 chegam como
  `switch 9` a `switch 16` e a fita como `light 17`, e se renomeiam no próprio
  Home Assistant. `Backlog WebButton1 OUT1; ...` até 16 põe os mesmos nomes nos
  botões dos relés da página da placa; não chega ao Home Assistant.
- **A variante, sem regras**:
  `Backlog SetOption114 0; SwitchMode0 0; Rule1 0; Rule2 0`. O próprio Tasmota
  liga cada entrada ao seu relé (`SwitchMode<n> 3` para um pulsador), e o Home
  Assistant mostra só os relés, porque o Tasmota deixa de anunciar as
  entradas. Trocar entre as duas remove ou recria os 16 sensores de entrada no
  Home Assistant, junto com qualquer área ou nome dado a eles lá.

### Os arquivos, a fita e o display da A16v3

Os dois arquivos são servidos de [`site/files/`](./site/files/) e linkados na
página:

- `pcf8574.dat` declara os 32 pinos dos expansores, 16 entradas como switches e
  16 relés invertidos. Sem ele, os expansores são detectados e nada pode ser
  acionado. As entradas vêm com as metades trocadas, como medido na placa: o
  chip em `0x21` tem as entradas 9 a 16, e o `0x22` as entradas 1 a 8.
- `display.ini` descreve o painel SSD1306, que não tem mais uma flag de build
  própria. Ele só é lido numa placa que liga o display.

**O template traz uma fita de LED WS2812** no `GPIO41`, pino 3 do conector
`P12` ao lado do ESP32-S3 (`39 40 41 GND 3V3`, furo quadrado no `3V3`, do
desenho da placa publicado pela própria KinCony). Sem fita ligada, a luz que
ele cria não acende nada. `Pixels` é quantos LEDs a fita tem, e o `Dimmer 30`
a mantém em 30% porque a fita puxa dos 5 V da placa, o trilho em que o ESP32
roda.

**O display fica desligado de propósito.** Ligá-lo exige uma marca Option A3 no
`GPIO45` (`6210`), e aí o display ocupa um power próprio
(`UpdateDevicesPresent(1)` em `xdrv_13_display.ino`): depois dos 16 relés ele
vira o power 17, a luz da fita passa para o 18 e para de responder no Home
Assistant, como visto na placa. Numa A16v3 sem a fita, ponha o `GPIO45` em
`6210` no template e o display liga.

## Achar a placa na rede

A página tem uma seção **Achar minha placa**. Com a placa no USB e a janela do
instalador fechada, ela abre a porta, pergunta `Status 5` e mostra os endereços
do Wi-Fi e do cabo como links para a página da própria placa. Nada é gravado.

À mão: **Instalar** no card da placa, escolha a porta, **Logs & Console**,
digite `Status 5` e tecle Enter. O `IPAddress` é o endereço do Wi-Fi e o que
está dentro de `"Ethernet"` é o do cabo; `0.0.0.0` quer dizer que aquele lado
não está conectado.

A placa só escuta pelo USB quando o cabo já estava ligado na hora em que ela
iniciou (`tasmota.ino`, "no SOF packet detected on USB port"). Uma placa
alimentada pelos 12 V antes não responde: o segundo botão da página,
**Reiniciar pelo USB e perguntar de novo**, a reinicia pelas linhas de reset
do USB para que responda.

## Problemas comuns

- **O instalador mostra "Disconnected" depois do passo do Wi-Fi.** O Tasmota
  reinicia para entrar na rede assim que o Improv entrega o Wi-Fi
  (`xdrv_62_improv.ino`), e estas placas expõem o USB direto do ESP32-S3,
  então o reinício faz a porta sumir. O Wi-Fi está salvo: espere 20 segundos e
  procure a placa no roteador, no Home Assistant ou com o **Achar minha
  placa**.
- **A tela do Wi-Fi foi pulada.** Sem Wi-Fi salvo, a placa abre uma rede
  própria, `tasmota-XXXX`. Entre nela e abra `http://192.168.4.1`.
- **A A16v3 nunca entra no Wi-Fi.** O módulo dela é o ESP32-S3-WROOM-1U, que
  não tem antena no módulo, só um conector para uma externa. Sem ela, a placa
  só entra num roteador bem perto. O cabo funciona em qualquer lugar.
- **O log serial diz "SHA-256 comparison failed".** É inofensivo: as linhas
  seguintes dizem `Attempting to boot anyway...`, e a placa inicia. Builds de
  antes de 24 de setembro de 2026 declaravam 4 MB no cabeçalho do bootloader;
  no primeiro boot o Tasmota reescreve esse byte para os 16 MB reais e deixa o
  hash como estava. Uma placa instalada ou atualizada pela página desde então
  para de mostrar a mensagem; uma atualização pela rede mantém o bootloader
  antigo, e a mensagem com ele.

## Como funciona

```text
cateim/Tasmota, branch tasmota-kincony
  └── cada push compila as duas placas e publica uma release, kincony-YYYYMMDD-<sha>

self-labs/tasmota-kincony (este repositório)
  └── o workflow do Pages pega a mais recente dessas releases, copia os
      .factory.bin para junto da página, grava a release nos manifestos e
      publica o site
```

Os binários são copiados para o site em vez de linkados, porque o ESP Web Tools
os busca pelo navegador, e os downloads de release do GitHub não mandam
cabeçalhos CORS. O site é publicado de novo a cada push aqui, uma vez por dia e
sob demanda pela aba **Actions**.

## Atualizar para um Tasmota mais novo

O firmware é o próprio Tasmota mais os dois ambientes de que estas placas
precisam, na branch `tasmota-kincony` do `cateim/Tasmota`. Atualizar é juntar
o upstream nela:

```bash
git remote add upstream https://github.com/arendst/Tasmota.git   # uma vez
git fetch upstream --tags
git checkout tasmota-kincony
git merge v15.7.0          # ou a release para a qual você está indo
git push origin tasmota-kincony
```

O push compila as duas placas, publica `kincony-YYYYMMDD-<sha>` e a marca como
a release mais recente. Este site pega isso na próxima execução, que é diária,
a cada push aqui, ou sob demanda pela aba **Actions**. A versão servida é a
que aparece no rodapé da página.

Só dois arquivos carregam as mudanças da casa: `platformio_tasmota_cenv.ini`,
com os dois ambientes, e o workflow que os compila e publica. Um conflito de
merge num deles é a única coisa que uma release oficial pode quebrar.

## Licenças

A página e o workflow são MIT, veja [LICENSE](./LICENSE). O firmware é o
Tasmota, GPL-3.0, compilado a partir da branch pública
[`tasmota-kincony`](https://github.com/cateim/Tasmota/tree/tasmota-kincony) do
`cateim/Tasmota`, que é o código completo dele.

Sem vínculo com a KinCony nem com o projeto Tasmota.

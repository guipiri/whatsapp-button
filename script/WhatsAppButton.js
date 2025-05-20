export const webhookUrlDefault =
  'https://script.google.com/macros/s/AKfycbyjPxc7oyFJmV-HK9Du8e70xe4cv7uyZ0pF34gK46XPK6RYTLdsWGZSnf2v2YKZWNM-qA/exec'

export const firstMessageDefault =
  'Meu nome é {name}, meu e-mail é {email}. Gostaria de informações!'

export const phoneNumberDefault = '5511999999999'

export const ctaTextDefault = 'Conversar'

export const titleDefault = 'Fale Conosco'

export const primaryColorDefault = '#075f55'

export const startOpenedDefault = false

export const fieldsDefault = [
  { name: 'name', placeholder: 'Nome', type: 'text', required: true },
  { name: 'email', placeholder: 'E-mail', type: 'email', required: true },
  {
    name: 'phone',
    placeholder: 'Número do WhatsApp',
    type: 'number',
    required: true,
  },
]

const formConfigDefaultt = {
  webhookUrl: webhookUrlDefault,
  firstMessage: firstMessageDefault,
  phoneNumber: phoneNumberDefault,
  ctaText: ctaTextDefault,
  primaryColor: primaryColorDefault,
  title: titleDefault,
  startOpened: startOpenedDefault,
  fields: fieldsDefault,
}

export default class WhatsAppButton {
  constructor({
    phoneNumber,
    firstMessage,
    webhookUrl,
    ctaText,
    primaryColor,
    title,
    startOpened,
    fields,
  } = formConfigDefaultt) {
    this.firstMessage = firstMessage || firstMessageDefault
    this.phoneNumber = phoneNumber || phoneNumberDefault
    this.webhookUrl = webhookUrl || webhookUrlDefault
    this.ctaText = ctaText || ctaTextDefault
    this.primaryColor = primaryColor || primaryColorDefault
    this.title = title || titleDefault
    this.startOpened = startOpened || startOpenedDefault
    this.fields = fields || fieldsDefault

    this.init()
  }

  generateHtmlContent() {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WhatsApp Button Widget</title>
      </head>
      <body>
        <div class="whatsapp-container">
          <div id="form-container" class="${this.startOpened ? '' : 'none'}">
            <header class="form-header">
              <h4>${this.title}</h4>
              <div class="close-icon"></div>
            </header>
            <div class="form">
              <form id="whatsapp-form">
                ${this.createInputFields(this.fields)}
                <button id="form-button" type="submit">${this.ctaText}</button>
              </form>
            </div>
          </div>
          <button class="whatsapp-button">
            <img
              src="https://pub-fab99594a03b41c38db0d04b26923694.r2.dev/wp-bt.svg"
              alt="WhatsApp Icon"
              width="60"
              height="60"
            />
          </button>
        </div>
      </body>
      </html>
    `
  }

  generateCSSContent() {
    return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Matter', sans-serif;
      font-size: 16px;
    }

    :root {
      --primary-color: #075f55;
      --secondary-color: #25d366;
    }

    body {
      background-color: transparent;
      height: 100vh;
    }

    .whatsapp-button {
      text-decoration: none;
      border: none;
      background-color: transparent;
      cursor: pointer;
      display: block;
      margin-left: auto;
      margin-top: 1rem;
    }

    .whatsapp-button:hover {
      transform: scale(1.1);
      transition: all 0.3s ease;
    }

    .whatsapp-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
    }

    .form-header {
      background-color: var(--primary-color);
      color: #fff;
      padding: 1rem 2rem;
      border-radius: 1rem 1rem 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .none {
      display: none;
    }

    #form-container {
      opacity: 0; /* Inicia invisível */
      transform: translateY(-20px); /* Sai um pouco para cima */
      transition: opacity 0.5s, transform 0.5s;
      animation: aparecer 1s forwards;
      margin-left: 20px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      border-radius: 1rem;
    }

    @keyframes aparecer {
      from {
        opacity: 0; /* Início invisível */
        transform: translateY(-20px); /* Sai um pouco para cima */
      }
      to {
        opacity: 1; /* Totalmente visível */
        transform: translateY(0); /* Posição final */
      }
    }

    .form {
      padding: 1.5rem;
      background-image: url(https://pub-fab99594a03b41c38db0d04b26923694.r2.dev/wp-bg.jpeg);
      border-radius: 0 0 1rem 1rem;
    }

    .form-field input {
      width: 100%;
      padding: 0.6rem 0.8rem;
      border-radius: 0.5rem;
      border: none;
      margin-bottom: 1.5rem;
      outline: none;
    }

    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      margin: 0;
    }

    #form-button {
      background-color: var(--primary-color);
      color: #fff;
      border: none;
      padding: 0.8rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.1s ease;
      display: block;
      width: 100%;
      transition: all 0.3s ease;
    }

    #form-button:hover {
      background-color: color-mix(
        in oklab,
        var(--primary-color) 80%,
        rgb(0, 0, 0) 20%
      );
    }

    .close-icon {
      position: relative;
      width: 24px;
      height: 24px;
      cursor: pointer;
      margin-left: 1rem;
    }

    .close-icon::before,
    .close-icon::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 24px;
      background-color: #ffffff;
      transform-origin: center;
    }

    .close-icon::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    .close-icon::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    `
  }

  createInputFields(fields) {
    const htmlFields = fields.reduce((acc, field) => {
      return ` ${acc}
        <div class="form-field">
          <input
            placeholder="${field.placeholder}"
            type="${field.type}"
            id="${field.name}"
            name="${field.name}"
            ${field.required && 'required'}
          />
        </div>`
    }, '')

    return htmlFields
  }

  replaceFirstMsgVars(name, email, phone, msg) {
    return msg
      .replace('{name}', name)
      .replace('{email}', email)
      .replace('{phone}', phone)
  }

  toggleShowForm() {
    const formContainer = this.iframeDoc.getElementById('form-container')
    formContainer.classList.toggle('none')
    this.toggleIframeSize()
  }

  showForm() {
    const formContainer = this.iframeDoc.getElementById('form-container')
    formContainer.classList.remove('none')
    this.setOpenedSize()
  }

  closeForm() {
    const formContainer = this.iframeDoc.getElementById('form-container')
    formContainer.classList.add('none')
    this.setClosedSize()
  }

  async fetchWebhookUrl(name, email, phone) {
    try {
      const res = await fetch(this.webhookUrl, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
        }),
      })
    } catch (error) {
      console.error('Error on fetching webhook URL.', error)
      return null
    }
  }

  async formSubmit(event) {
    event.preventDefault()
    event.stopPropagation()

    const formButton = this.iframeDoc.getElementById('form-button')
    formButton.setAttribute('disabled', true)
    formButton.innerText = 'Enviando...'

    const form = this.iframeDoc.getElementById('whatsapp-form')
    const name = form.name.value
    const email = form.email.value
    const phone = form.phone.value

    await this.fetchWebhookUrl(name, email, phone)

    formButton.removeAttribute('disabled')
    formButton.innerText = this.ctaText
    form.reset()

    this.toggleShowForm()

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${
      this.phoneNumber
    }&text=${this.replaceFirstMsgVars(name, email, phone, this.firstMessage)}`

    window.parent.postMessage('whatsappp-button-form-submitted', '*')
    window.open(whatsappUrl, '_blank')
  }

  toggleIframeSize() {
    const openedWidth = '20rem'

    if (this.iframe.style.width === openedWidth) {
      this.setClosedSize()
    } else {
      this.setOpenedSize()
    }
  }

  setOpenedSize() {
    const openedWidth = '20rem'
    const openedHeight = '29.2rem'
    this.iframe.style.width = openedWidth
    this.iframe.style.height = openedHeight
  }

  setClosedSize() {
    const closedWidthAndHeight = '6rem'
    this.iframe.style.width = closedWidthAndHeight
    this.iframe.style.height = closedWidthAndHeight
  }

  setIframeInitialStyle() {
    this.iframe.style.border = 'none'
    this.iframe.style.position = 'fixed'
    this.iframe.style.bottom = '0'
    this.iframe.style.right = '0'
    this.iframe.style.zIndex = '99999'

    if (this.startOpened) {
      this.setOpenedSize()
    } else {
      this.setClosedSize()
    }
  }

  createIframeDoc() {
    const iframe = document.createElement('iframe')
    iframe.id = 'whatsapp-button-iframe'
    this.iframe = iframe

    document.body.appendChild(iframe)
    this.iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  }

  init() {
    this.createIframeDoc()

    this.setIframeInitialStyle()

    // Listen to the message event from the parent window to open or close form
    this.iframe.onload = () => {
      this.iframe.contentWindow.onmessage = (event) => {
        if (event.data === 'open-whatsapp-forms') {
          this.showForm()
        }
        if (event.data === 'close-whatsapp-forms') {
          this.closeForm()
        }
      }
    }

    // Insere o html dentro do iframe
    this.iframeDoc.open()
    this.iframeDoc.writeln(this.generateHtmlContent())
    this.iframeDoc.close()

    // Insere o CSS no iframe
    const style = this.iframeDoc.createElement('style')
    style.textContent = this.generateCSSContent()
    this.iframeDoc.head.appendChild(style)

    // Adiciona os eventos de click e submit dentro do iframe
    const whatsappButton =
      this.iframeDoc.getElementsByClassName('whatsapp-button')[0]
    const closeXButton = this.iframeDoc.getElementsByClassName('close-icon')[0]
    const form = this.iframeDoc.getElementById('whatsapp-form')

    if (form) {
      form.addEventListener('submit', (e) => this.formSubmit(e))
    }

    if (whatsappButton) {
      whatsappButton.addEventListener('click', () => this.toggleShowForm())
    }

    if (closeXButton) {
      closeXButton.addEventListener('click', () => this.toggleShowForm())
    }
  }

  remove() {
    this.iframe.remove()
  }
}

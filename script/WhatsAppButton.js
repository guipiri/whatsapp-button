class WhatsAppButton {
  constructor({
    phoneNumber,
    firstMessage,
    webhookUrl,
    ctaText,
    primaryColor,
    title,
    htmlContent,
    cssContent,
  }) {
    this.firstMessage = firstMessage
    this.phoneNumber = phoneNumber
    this.webhookUrl = webhookUrl
    this.ctaText = ctaText
    this.primaryColor = primaryColor
    this.title = title
    this.htmlContent = htmlContent
    this.cssContent = cssContent
  }

  baseHtml = `
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>WhatsApp Button</title>
    </head>
    <body></body>
  </html>
`

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
    const openedHeight = '29.2rem'
    const closedWidthAndHeight = '6rem'

    if (this.iframe.style.width === openedWidth) {
      this.iframe.style.width = closedWidthAndHeight
      this.iframe.style.height = closedWidthAndHeight
    } else {
      this.iframe.style.width = openedWidth
      this.iframe.style.height = openedHeight
    }
  }

  setOpenedSize() {
    const openedWidth = '20rem'
    const openedHeight = '29.2rem'
    this.iframe.style.width = openedWidth
    this.iframe.style.height = openedHeight
  }

  init() {
    const iframe = document.createElement('iframe')
    iframe.style.border = 'none'
    iframe.style.position = 'fixed'
    iframe.style.width = '6rem'
    iframe.style.height = '6rem'
    iframe.style.bottom = '0'
    iframe.style.right = '0'
    iframe.id = 'whatsapp-button-iframe'
    iframe.style.zIndex = '99999'

    document.body.appendChild(iframe)

    // Define o iframe e o iframeDoc na classe WhatsAppButton
    this.iframe = iframe
    this.iframeDoc = iframe.contentDocument || iframe.contentWindow.document

    // Listen to the message event from the parent window to open the forms
    iframe.onload = () => {
      iframe.contentWindow.onmessage = (event) => {
        console.log(this)
        if (event.data === 'open-whatsapp-forms') {
          this.showForm()
        }
      }
    }

    // Insere o base html dentro do iframe
    this.iframeDoc.open()
    this.iframeDoc.writeln(this.baseHtml)
    this.iframeDoc.close()

    // Insere o htmlContent dentro do iframe
    this.iframeDoc.body.innerHTML = this.htmlContent

    // Insere o CSS no iframe
    const style = this.iframeDoc.createElement('style')
    style.textContent = this.cssContent
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
}

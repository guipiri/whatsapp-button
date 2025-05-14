class WhatsAppButton {
  constructor(
    phoneNumber,
    firstMessage,
    webhookUrl,
    ctaText,
    primaryColor,
    title,
    htmlContent,
    cssContent
  ) {
    this.firstMessage = firstMessage
    this.phoneNumber = phoneNumber
    this.webhookUrl = webhookUrl
    this.ctaText = ctaText
    this.primaryColor = primaryColor
    this.title = title
    this.htmlContent = htmlContent
    this.cssContent = cssContent
  }

  replaceFirstMsgVars(name, email, phone, msg) {
    return msg
      .replace('{{name}}', name)
      .replace('{{email}}', email)
      .replace('{{phone}}', phone)
  }

  toggleShowForm() {
    const formContainer = document.getElementById('form-container')
    formContainer.classList.toggle('none')
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

    const formButton = document.getElementById('form-button')
    formButton.setAttribute('disabled', true)
    formButton.innerText = 'Enviando...'

    const form = document.getElementById('whatsapp-form')
    const name = form.name.value
    const email = form.email.value
    const phone = form.phone.value

    await this.fetchWebhookUrl(name, email, phone)

    formButton.removeAttribute('disabled')
    formButton.innerText = 'Conversar'
    form.reset()

    this.toggleShowForm()

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${
      this.phoneNumber
    }&text=${this.replaceFirstMsgVars(name, email, phone, this.firstMessage)}`

    window.open(whatsappUrl, '_blank')
  }

  init() {
    document
      .getElementsByTagName('body')[0]
      .insertAdjacentHTML('beforeend', this.htmlContent)

    const style = document.createElement('style')
    style.textContent = this.cssContent
    document.head.appendChild(style)

    const whatsappButton = document.getElementsByClassName('whatsapp-button')[0]
    const closeXButton = document.getElementsByClassName('close-icon')[0]
    const form = document.getElementById('whatsapp-form')

    form.addEventListener('submit', (e) => this.formSubmit(e, this))

    whatsappButton.addEventListener('click', this.toggleShowForm)
    closeXButton.addEventListener('click', this.toggleShowForm)
  }
}

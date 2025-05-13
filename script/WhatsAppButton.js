export default class WhatsAppButton {
  constructor(
    whatsAppPhoneNumber,
    whatsAppFirstMessage,
    webhookUrl,
    ctaText,
    primaryColor,
    title,
    htmlContent,
    cssContent
  ) {
    this.whatsAppFirstMessage = whatsAppFirstMessage
    this.whatsAppPhoneNumber = whatsAppPhoneNumber
    this.webhookUrl = webhookUrl
    this.ctaText = ctaText
    this.primaryColor = primaryColor
    this.title = title
    this.htmlContent = htmlContent
    this.cssContent = cssContent
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

  async formSubmit(event, thisObject) {
    event.preventDefault()

    const formButton = document.getElementById('form-button')
    formButton.setAttribute('disabled', true)
    formButton.innerText = 'Enviando...'

    const form = document.getElementById('whatsapp-form')
    const name = form.name.value
    const email = form.email.value
    const phone = form.phone.value

    await thisObject.fetchWebhookUrl(name, email, phone)

    formButton.removeAttribute('disabled')
    formButton.innerText = 'Conversar'
    form.reset()

    thisObject.toggleShowForm()

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${
      thisObject.whatsAppPhoneNumber
    }&text=${thisObject.whatsAppFirstMessage(name, email, phone)}`

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

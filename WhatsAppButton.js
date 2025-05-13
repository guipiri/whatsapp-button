class WhatsAppButton {
  constructor(
    whatsAppPhoneNumber,
    whatsAppFirstMessage,
    appScriptUrl,
    aditionalCss
  ) {
    this.whatsAppFirstMessage = whatsAppFirstMessage
    this.whatsAppPhoneNumber = whatsAppPhoneNumber
    this.appScriptUrl = appScriptUrl
    this.cssContent = this.cssContent + aditionalCss
  }

  htmlContent = `
    <div class="whatsapp-container">
      <div id="form-container" class="none">
        <header class="form-header">
          <h4>Fale Conosco</h4>
          <div class="close-icon"></div>
        </header>
        <div class="form">
          <form id="whatsapp-form">
            <div class="form-field">
              <input
                placeholder="Nome"
                type="text"
                id="name"
                name="name"
                required
              />
            </div>
            <div class="form-field">
              <input
                placeholder="E-mail"
                type="email"
                id="email"
                name="email"
                required
              />
            </div>
            <div class="form-field">
              <input
                placeholder="Número do WhatsApp"
                type="number"
                id="phone"
                name="phone"
                required
              />
            </div>
            <button id="form-button" type="submit">Conversar</button>
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
  `

  cssContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Matter', sans-serif;
      font-size: 16px;
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
      bottom: 20px;
      right: 20px;
    }

    .form-header {
      background-color: #075f55;
      color: #fff;
      padding: 1rem;
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
      padding: 1rem;
      background-image: url(https://pub-fab99594a03b41c38db0d04b26923694.r2.dev/wp-bg.jpeg);
      border-radius: 0 0 1rem 1rem;
    }

    .form-field input {
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: none;
      margin-bottom: 1rem;
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
      background-color: #075f55;
      color: #fff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.1s ease;
      display: block;
      width: 100%;
    }

    #form-button:hover {
      background-color: #0a7d73;
    }

    .close-icon {
      position: relative;
      width: 24px;
      height: 24px;
      cursor: pointer;
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

  toggleShowForm() {
    const formContainer = document.getElementById('form-container')
    formContainer.classList.toggle('none')
  }

  async saveDataOnSpreadsheet(name, email, phone) {
    const res = await fetch(this.appScriptUrl, {
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
    const json = await res.json()
    return json
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

    await thisObject.saveDataOnSpreadsheet(name, email, phone)

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

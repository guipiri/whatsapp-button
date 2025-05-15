# WhatsApp Button Widget Generator

A simple and customizable WhatsApp button widget generator with form integrated. Send form data through a webhook url.

## Features

- Easy to implement WhatsApp button
- Basic customizable button and form styles
- Form integration for collecting user information
- Mobile-friendly and responsive design
- Configurable pre-filled messages

## Installation

1. Generate your custom code through the <a href="https://whatsapp-button.pages.dev" target="_blank" rel="noopener noreferrer">WhatsApp Button Widget Generator</a>. See your preview on the side of the same page.

2. Copy the generated code and paste it into your HTML file before the closing `</body>` tag. For example:

## Configuration Options

| Option       | Type   | Default                                                                                                                             | Description                                                   |
| ------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| primaryColor | string | #075f55                                                                                                                             | Button and form header background color                       |
| title        | string | Fale Conosco                                                                                                                        | Form title. See it only when form opened                      |
| phoneNumber  | string | 5511999999999                                                                                                                       | Your WhatsApp number with country code to receive the message |
| firstMessage | string | Olá, meu nome é {name} e gostaria de informações!                                                                                   | Default first message to be sent. It can be changed by user.  |
| webhookUrl   | string | [AppScript URL]("https://script.google.com/macros/s/AKfycby1E9BQCd5Qh-luovTfTsJk7_zYimoRNHPj4ASW61uyzSMYmbOWywW7j0frPXso1j96/exec") | Webhook URL to send form data.                                |

## Webhook Configuration

You can send form data through a webhook url. When the form is submitted, we fetch this url with a `POST` request with JSON `body` like this:

```javascript
{
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "5511999999999",
}
```

### How to send form data to a Google Sheet?

1.  Create a [new Google Spreadsheet](sheets.new).

2.  In the spreadsheet, go to `Extension > Apps Script`.

3.  Copy the code below, replace `SPREADSHEET_URL` and `SHEET_NAME`, paste it into the Apps Script editor and save it.

    ```javascript
    const ssUrl = 'SPREADSHEET_URL'
    const sheetName = 'SHEET_NAME'

    function createResponse(resJson) {
      const response = ContentService.createTextOutput(JSON.stringify(resJson))
      response.setMimeType(ContentService.MimeType.TEXT)
      return response
    }

    function doPost(e) {
      try {
        const sheet = SpreadsheetApp.openByUrl(ssUrl).getSheetByName(sheetName)
        const contents = JSON.parse(e.postData.contents)

        const name = contents.name
        const phone = contents.phone
        const email = contents.email

        // Validate required fields
        if (!name || !phone || !email) {
          return createResponse({
            success: false,
            message: 'Todos os campos são obrigatórios!',
          })
        }

        // Append the data
        sheet.appendRow([name, phone, email, new Date()])

        return createResponse({
          success: true,
          message: 'Dados recebidos!',
        })
      } catch (error) {
        return createResponse({
          success: false,
          message: error.message,
        })
      }
    }
    ```

4.  In Project Settings, add any [GCP](https://console.cloud.google.com/) project number in `Google Cloud Platform (GCP) Project` section. Also there, enable the `Show "appsscript.json" manifest file in editor` option.

5.  In Editor, click `appsscript.json` file and add to the json the `oauthScopes` property with the value `["https://www.googleapis.com/auth/spreadsheets"]`. Example:

    ```json
    {
      "timeZone": "America/Sao_Paulo",
      "dependencies": {},
      "exceptionLogging": "STACKDRIVER",
      "runtimeVersion": "V8",
      "oauthScopes": ["https://www.googleapis.com/auth/spreadsheets"]
    }
    ```

6.  Click `Deploy > New deployment`, select `Web app` type. Set `Execute as` to `Me` and `Who has access to the app` to `Anyone`. Click `Deploy`.

7.  Copy the Web App URL and paste it in the `Webhook URL` option in the WhatsApp Button Widget Generator.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Contact

If you have any questions or suggestions, please feel free to contact me at my [email](mailto:gui.soliveiras@gmail.com).

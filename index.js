const AmoCRM = require('amocrm-js');

const crm = new AmoCRM({
    // логин пользователя в портале, где адрес портала domain.amocrm.ru
    domain: 'domain', // может быть указан полный домен вида domain.amocrm.ru, domain.amocrm.com
    /* 
      Информация об интеграции (подробности подключения 
      описаны на https://www.amocrm.ru/developers/content/oauth/step-by-step)
    */
      auth: {
        client_id: 'clientId', // ID интеграции
        client_secret: 'clientSecret', // Секретный ключ
        redirect_uri: 'redirectUri', // Ссылка для перенаправления
        code: 'code' // Код авторизации
      },
});

async function getContacts() { //Функция для получения всех контактов
    const url = '/api/v4/contacts?with=leads&page=1&limit=50'
    const contacts = await crm.request.get(url)
    return (contacts.data._embedded.contacts)
}

(async () => { //Функция, которая создает для всех контактов без сделок новую задачу с тектом 'Контакт без сделок'
    await getContacts().then(contacts => {
        contacts.map(contact => {
            if (contact._embedded.leads.length == 0) {
                (async () => {
                    const res = await crm.request.post('/api/v4/tasks', [
                        {
                            text: "Контакт без сделок",
                            complete_till: 1650881787,
                            entity_id: contact.id,
                            entity_type: "contacts",
                        }
                    ])
                })()
            }
        })
    })
})()

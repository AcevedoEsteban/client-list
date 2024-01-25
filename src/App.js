import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [contacts, setContacts] = useState([])
  const [currentContact, setCurrentContact] = useState(null)
  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [emailAddresses, setEmailAddresses] = useState([])
  const [newContactName, setNewContactName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [newEmailAddress, setNewEmailAddress] = useState('')
  const [stats, setStats] = useState(null)
  const [showStats, setShowStats] = useState(false)
  const [newPhoneType, setNewPhoneType] = useState('Mobile')
  const [newEmailType, setNewEmailType] = useState('Personal')
  const [phoneError, setPhoneError] = useState('')
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    const storedContacts = localStorage.getItem('contacts')
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts))
    }
  }, [])

  useEffect(() => {
    const calculateStats = () => {
      const stats = {
        numberOfContacts: contacts.length,
        numberOfPhones: contacts.reduce(
          (sum, contact) => sum + contact.phones.length,
          0
        ),
        numberOfEmails: contacts.reduce(
          (sum, contact) => sum + contact.emails.length,
          0
        ),
        newestContactTimestamp: contacts.length
          ? Math.max(...contacts.map((contact) => contact.id))
          : 0,
        oldestContactTimestamp: contacts.length
          ? Math.min(...contacts.map((contact) => contact.id))
          : 0,
      }
      setStats(stats)
    }

    calculateStats()
  }, [contacts])

  const saveContactsToLocalStorage = (updatedContacts) => {
    localStorage.setItem('contacts', JSON.stringify(updatedContacts))
    setContacts(updatedContacts)
  }

  const addContact = (name) => {
    const newContact = {
      id: Date.now(),
      name,
      phones: [],
      emails: [],
    }
    const updatedContacts = [...contacts, newContact]
    saveContactsToLocalStorage(updatedContacts)
    setNewContactName('')
  }

  const deleteContact = (contactId) => {
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactId
    )
    saveContactsToLocalStorage(updatedContacts)
  }

  const viewContact = (contactId) => {
    const contact = contacts.find((contact) => contact.id === contactId)
    if (contact) {
      setCurrentContact(contactId)
      setPhoneNumbers(contact.phones)
      setEmailAddresses(contact.emails)
    }
  }

  const addPhoneNumber = (contactId, type, number) => {
    if (number.length !== 10 || isNaN(number)) {
      setPhoneError('Phone number must be exactly 10 digits.')
      return
    }

    const newPhoneNumber = { id: Date.now(), type, number }
    const updatedContacts = contacts.map((contact) => {
      if (contact.id === contactId) {
        if (currentContact === contactId) {
          setPhoneNumbers([...phoneNumbers, newPhoneNumber])
        }
        return { ...contact, phones: [...contact.phones, newPhoneNumber] }
      }
      return contact
    })
    saveContactsToLocalStorage(updatedContacts)
    setNewPhoneNumber('')
    setPhoneError('')
  }

  const addEmailAddress = (contactId, type, address) => {
    if (!address.includes('@') || address.trim() === '') {
      setEmailError('Invalid email address.')
      return
    }

    const newEmailAddress = { id: Date.now(), type, address }
    const updatedContacts = contacts.map((contact) => {
      if (contact.id === contactId) {
        if (currentContact === contactId) {
          setEmailAddresses([...emailAddresses, newEmailAddress])
        }
        return { ...contact, emails: [...contact.emails, newEmailAddress] }
      }
      return contact
    })
    saveContactsToLocalStorage(updatedContacts)
    setNewEmailAddress('')
    setEmailError('')
  }

  const deletePhoneNumber = (contactId, phoneId) => {
    const updatedContacts = contacts.map((contact) => {
      if (contact.id === contactId) {
        const updatedPhones = contact.phones.filter(
          (phone) => phone.id !== phoneId
        )
        if (currentContact === contactId) {
          setPhoneNumbers(updatedPhones)
        }
        return { ...contact, phones: updatedPhones }
      }
      return contact
    })
    saveContactsToLocalStorage(updatedContacts)
  }

  const deleteEmailAddress = (contactId, emailId) => {
    const updatedContacts = contacts.map((contact) => {
      if (contact.id === contactId) {
        const updatedEmails = contact.emails.filter(
          (email) => email.id !== emailId
        )
        if (currentContact === contactId) {
          setEmailAddresses(updatedEmails)
        }
        return { ...contact, emails: updatedEmails }
      }
      return contact
    })
    saveContactsToLocalStorage(updatedContacts)
  }

  const toggleViewContact = (contactId) => {
    if (currentContact === contactId) {
      setCurrentContact(null)
      setPhoneNumbers([])
      setEmailAddresses([])
    } else {
      viewContact(contactId)
    }
  }

  const fetchStats = () => {
    const stats = {
      numberOfContacts: contacts.length,
      numberOfPhones: contacts.reduce(
        (sum, contact) => sum + contact.phones.length,
        0
      ),
      numberOfEmails: contacts.reduce(
        (sum, contact) => sum + contact.emails.length,
        0
      ),
      newestContactTimestamp: Math.max(
        ...contacts.map((contact) => contact.id)
      ),
      oldestContactTimestamp: Math.min(
        ...contacts.map((contact) => contact.id)
      ),
    }
    setStats(stats)
  }

  return (
    <div className='min-h-screen bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center backdrop-blur-md'>
      <div className='p-10 rounded-xl bg-white w-4/5 max-w-xl shadow-xl bg-opacity-90'>
        <h1 className='text-3xl mb-5 text-center font-bold font-poppins'>
          Clients
        </h1>

        <div className='contact-input-section mb-5 flex justify-between font-poppins'>
          <input
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
            className='w-2/3 flex-grow mr-2 p-2 rounded border-3 border-gray-300'
            type='text'
            placeholder='Enter Clients Name'
          />
          <button
            className='w-1/3 p-2 rounded bg-gray-200 text-black hover:bg-gray-300 transition'
            onClick={() => addContact(newContactName)}>
            {/* Esteban Clinets list */}
            {/* testing */}
            Create Client
          </button>
        </div>

        <div className='contacts-list font-poppins'>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className='contact-item mb-4 border-2 p-4 rounded shadow bg-gray-100 cursor-pointer'
              onClick={() => toggleViewContact(contact.id)}>
              <div className='contact-header flex justify-between items-center'>
                <span className='font-medium'>{contact.name}</span>
                <button
                  className='bg-red-400 text-white rounded p-2 hover:bg-red-500 transition'
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteContact(contact.id)
                  }}>
                  Delete
                </button>
              </div>

              {currentContact === contact.id && (
                <div
                  className='contact-detail mt-4'
                  onClick={(e) => e.stopPropagation()}>
                  <div className='phone-input-section n mb-4 flex flex-col'>
                    <div className='error-message-container'>
                      {phoneError && (
                        <div className='error-message bg-red-500 text-white p-1 rounded text-left'>
                          {phoneError}
                        </div>
                      )}
                    </div>

                    <div className='input-group flex justify-between items-center'>
                      {' '}
                      <input
                        value={newPhoneNumber}
                        onChange={(e) => setNewPhoneNumber(e.target.value)}
                        className='flex-grow mr-2 p-2 rounded border-2'
                        type='text'
                        placeholder='Phone Number'
                        id={`phone-input-${contact.id}`}
                      />
                      <select
                        value={newPhoneType}
                        onChange={(e) => setNewPhoneType(e.target.value)}
                        className='w-1/1 mr-2 p-2 rounded border-2'
                        id={`phone-type-${currentContact}`}>
                        {[
                          'Cell',
                          "What's App",
                          'Work',
                          'Home',
                          'Main',
                          'Work fax',
                          'Home fax',
                          'Pager',
                          'Phone Other',
                          'Phone Custom',
                        ].map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <button
                        className='w-1/4 bg-gray-200 text-black rounded p-2 hover:bg-gray-300 transition'
                        onClick={() => {
                          const number = document.querySelector(
                            `#phone-input-${contact.id}`
                          ).value
                          const type = document.querySelector(
                            `#phone-type-${contact.id}`
                          ).value
                          addPhoneNumber(contact.id, type, number)
                          setNewPhoneNumber('')
                          setNewPhoneType('Mobile')
                        }}>
                        Add
                      </button>
                    </div>
                  </div>

                  <div className='email-input-section mb-4 flex flex-col'>
                    <div className='error-message-container'>
                      {emailError && (
                        <div className='error-message bg-red-500 text-white p-1 rounded text-left'>
                          {emailError}
                        </div>
                      )}
                    </div>
                    <div className='input-group flex justify-between items-center'>
                      <input
                        value={newEmailAddress}
                        onChange={(e) => setNewEmailAddress(e.target.value)}
                        className='flex-grow mr-2 p-2 rounded border-2'
                        type='text'
                        placeholder='Email Address'
                        id={`email-input-${currentContact}`}
                      />
                      <select
                        value={newEmailType}
                        onChange={(e) => setNewEmailType(e.target.value)}
                        className='w-1/1 mr-2 p-2 rounded border-2'
                        id={`email-type-${currentContact}`}>
                        {[
                          'Email Personal',
                          'Email Work',
                          'Email Other',
                          'Email Private ',
                        ].map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <button
                        className='w-1/4 bg-gray-200 text-black rounded p-2 hover:bg-gray-300 transition'
                        onClick={() => {
                          const address = document.querySelector(
                            `#email-input-${currentContact}`
                          ).value
                          const type = document.querySelector(
                            `#email-type-${currentContact}`
                          ).value
                          addEmailAddress(currentContact, type, address)
                          setNewEmailAddress('')
                          setNewEmailType('Personal')
                        }}>
                        Add
                      </button>
                    </div>
                  </div>

                  <div className='phone-list'>
                    {phoneNumbers.map((phone) => (
                      <div
                        key={phone.id}
                        className='phone-item mb-2 flex justify-between'>
                        <span>
                          {phone.type}: {phone.number}
                        </span>
                        <button
                          className='bg-red-400 text-white text-sm rounded p-1 hover:bg-red-500 transition'
                          onClick={() =>
                            deletePhoneNumber(contact.id, phone.id)
                          }>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className='email-list'>
                    {' '}
                    {emailAddresses.map((email) => (
                      <div
                        key={email.id}
                        className='email-item mb-2 flex justify-between'>
                        <span>
                          {email.type}: {email.address}
                        </span>
                        <button
                          className='bg-red-400 text-white text-sm rounded p-1 hover:bg-red-500 transition'
                          onClick={() =>
                            deleteEmailAddress(contact.id, email.id)
                          }>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='stats-section mt-5 font-poppins'>
          <button
            className='p-2 rounded bg-gray-200 text-black hover:bg-gray-300 transition w-full'
            onClick={() => {
              fetchStats()
              setShowStats(!showStats)
            }}>
            {showStats ? 'Hide Statistics' : 'Show Statistics'}
          </button>
          {showStats && stats && (
            <div className='stats-container mb-4 border-2 p-4 rounded shadow bg-gray-100'>
              <h2 className='text-2xl mb-4 font-bold'>Statistics</h2>
              <ul>
                <li>Number of Clients: {stats.numberOfContacts}</li>
                <li>Number of Phones: {stats.numberOfPhones}</li>
                <li>Number of Emails: {stats.numberOfEmails}</li>
                <li>Newest Client Timestamp: {stats.newestContactTimestamp}</li>
                <li>
                  Oldest Contact Timestamp: {stats.oldestContactTimestamp}
                </li>
              </ul>
              <br />
              <button
                className='p-2 rounded bg-gray-200 text-black hover:bg-gray-300 transition w-full'
                onClick={fetchStats}>
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

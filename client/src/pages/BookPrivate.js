import React, {useState} from "react";

function BookPrivate() {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    // TODO: actually send the message to flowwithmegmo@gmail.com with return address set as email
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('submitted!')
        setEmail("");
        setMessage("")
    }

	return (
		<div className="main-section book-private-section">
		<form className="contact-form" onSubmit={handleSubmit}>
			<input className="contact-email-input" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="Email"/>
			<textarea className="contact-message-input" value={message} onChange={(e)=> setMessage(e.target.value)} placeholder="Message"/>
            <input className="contact-submit btn btn-green" type="submit"/> 
		</form>
		</div>
	);}

export default BookPrivate;

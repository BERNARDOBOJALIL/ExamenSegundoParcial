import emailjs from "@emailjs/browser";

const generateEmailMessage = async (order, uid) => {
  const { timestamp, payment, total, items, client, table_number } = order;

  // Convertir la marca de tiempo a una fecha legible
  const user = JSON.parse(localStorage.getItem("userData"))
  const email = user.email
  const date = timestamp.toDate().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  // Generar el listado de ítems en HTML
  const itemsList = items
    .map(
      (item) =>
        `<li style="margin-bottom: 5px;">
          <span style="font-weight: bold;">${item.name}</span> - 
          $${item.price} x ${item.quantity}
        </li>`
    )
    .join("");

  // Cuerpo del mensaje
  const emailHtmlMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4CAF50; text-align: center;">Detalles de su Orden</h1>
      <p style="font-size: 16px;">
        <strong>Cliente:</strong> ${client || "No especificado"}<br>
        <strong>Fecha:</strong> ${date}<br>
        <strong>Método de Pago:</strong> ${payment}<br>
        <strong>Total:</strong> $${total.toFixed(2)}<br>
        <strong>Número de Mesa:</strong> ${table_number || "N/A"}<br>
        <strong>ID de Orden:</strong> ${uid}
      </p>
      <hr style="border: 1px solid #ddd; margin: 20px 0;">
      <h2 style="color: #4CAF50; font-size: 18px;">Objetos Comprados:</h2>
      <ul style="list-style-type: none; padding: 0;">
        ${itemsList}
      </ul>
      <hr style="border: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 14px; color: #777; text-align: center;">
        Gracias por su compra. Si tiene alguna pregunta, no dude en contactarnos.
      </p>
    </div>
  `;
  const subject = `El sabor de Berny - Ticket de Compra - ${date}`;
  console.log(subject)
  await SendCustomEmail(email, subject, emailHtmlMessage);
};


const SendCustomEmail = async (email, subject, emailHtmlMessage) => {
  emailjs.init(import.meta.env.VITE_EMAIL_USER_ID);
  await emailjs
    .send(
      import.meta.env.VITE_EMAIL_SERVICE_ID, 
      import.meta.env.VITE_EMAIL_TEMPLATE_ID, 
      {
        to_email: email,
        subject: subject,
        message: emailHtmlMessage,
      }
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
export { generateEmailMessage };

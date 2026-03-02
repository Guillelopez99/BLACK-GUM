import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configurar transporte de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, projectType, projectSummary, budget } = body;

    // Validación básica
    if (!name || !email || !projectSummary) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Enviar email a Black Gum
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'info@blackgumgroup.com',
      replyTo: email,
      subject: `Nuevo Proyecto: ${projectType || 'Consulta General'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF9846;">Nueva Solicitud de Proyecto</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Tipo de Proyecto:</strong> ${projectType || 'No especificado'}</p>
            <p><strong>Presupuesto:</strong> ${budget || 'No especificado'}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Resumen del Proyecto:</h3>
            <p style="white-space: pre-wrap; color: #555;">${projectSummary}</p>
          </div>

          <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px; font-size: 12px; color: #999;">
            <p>Este email fue enviado desde el formulario de contacto de blackgumgroup.com</p>
          </div>
        </div>
      `,
    });

    // Enviar confirmación al cliente
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Hemos recibido tu consulta - Black Gum Studio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF9846;">¡Gracias por tu consulta!</h2>
          
          <p>Hola ${name},</p>
          
          <p>Hemos recibido tu solicitud de proyecto y la revisaremos cuidadosamente.</p>
          
          <p>Nuestro equipo se pondrá en contacto contigo dentro de dos días hábiles con reflexiones iniciales y próximos pasos.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Detalles de tu consulta:</h3>
            <p><strong>Tipo de Proyecto:</strong> ${projectType || 'No especificado'}</p>
            <p><strong>Presupuesto:</strong> ${budget || 'No especificado'}</p>
          </div>

          <p>¿Preguntas urgentes? Escríbenos por WhatsApp o contáctanos directamente a <a href="mailto:info@blackgumgroup.com">info@blackgumgroup.com</a></p>
          
          <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px; font-size: 12px; color: #999;">
            <p><strong>Black Gum Studio</strong></p>
            <p>Madrid, España</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Consulta enviada exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en contacto:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user)
      return NextResponse.json({ message: "Wysłano prośbę" }, { status: 200 });

    const token = crypto.randomBytes(32).toString("hex");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resetowanie hasła w FlowBoard",
      html: `
          <!DOCTYPE html>
          <html lang="pl">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Resetowanie hasła - FlowBoard</title>
          </head>

          <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
            font-family: Arial, Helvetica, sans-serif;
            color: #18181b;
          ">

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="background-color: #f4f4f5; padding: 40px 16px;"
            >
              <tr>
                <td align="center">

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                      max-width: 520px;
                      background-color: #ffffff;
                      border-radius: 16px;
                      overflow: hidden;
                      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
                    "
                  >

                    <!-- Header -->
                    <tr>
                      <td
                        style="
                          padding: 32px 32px 24px;
                          text-align: center;
                          border-bottom: 1px solid #e4e4e7;
                        "
                      >
                  
                        <h1 style="
                          margin: 0;
                          font-size: 24px;
                          line-height: 32px;
                          font-weight: 700;
                          color: #18181b;
                        ">
                          Resetowanie hasła
                        </h1>

                        <p style="
                          margin: 8px 0 0;
                          font-size: 14px;
                          line-height: 22px;
                          color: #71717a;
                        ">
                          FlowBoard
                        </p>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 32px;">

                        <p style="
                          margin: 0 0 16px;
                          font-size: 16px;
                          line-height: 26px;
                        ">
                          Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.
                        </p>

                        <p style="
                          margin: 0 0 28px;
                          font-size: 14px;
                          line-height: 24px;
                          color: #52525b;
                        ">
                          Kliknij poniższy przycisk, aby ustawić nowe hasło.
                          Jeśli to nie Ty wysłałeś tę prośbę, możesz zignorować tę
                          wiadomość.
                        </p>

                        <!-- Button -->
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                          width="100%"
                        >
                          <tr>
                            <td align="center">

                              <a
                                href="http://localhost:3000/reset-password?token=${token}"
                                style="
                                  display: inline-block;
                                  width: 100%;
                                  box-sizing: border-box;
                                  padding: 14px 24px;
                                  background-color: #18181b;
                                  color: #ffffff;
                                  text-decoration: none;
                                  text-align: center;
                                  font-size: 14px;
                                  font-weight: 600;
                                  border-radius: 8px;
                                "
                              >
                                Zresetuj hasło
                              </a>

                            </td>
                          </tr>
                        </table>

                        <!-- Security info -->
                        <div style="
                          margin-top: 28px;
                          padding: 16px;
                          background-color: #f4f4f5;
                          border-radius: 10px;
                        ">

                          <p style="
                            margin: 0;
                            font-size: 13px;
                            line-height: 20px;
                            color: #52525b;
                          ">
                            <strong>Ważne:</strong> Link do resetowania hasła jest
                            jednorazowy i ma ograniczony czas ważności.
                          </p>

                        </div>

                        <p style="
                          margin: 28px 0 0;
                          font-size: 12px;
                          line-height: 20px;
                          color: #a1a1aa;
                        ">
                          Jeśli przycisk nie działa, skopiuj poniższy adres do
                          przeglądarki:
                        </p>

                        <p style="
                          margin: 8px 0 0;
                          font-size: 12px;
                          line-height: 18px;
                          word-break: break-all;
                          color: #71717a;
                        ">
                          http://localhost:3000/reset-password?token=${token}
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="
                        padding: 20px 32px;
                        background-color: #fafafa;
                        border-top: 1px solid #e4e4e7;
                        text-align: center;
                      ">

                        <p style="
                          margin: 0;
                          font-size: 12px;
                          color: #a1a1aa;
                        ">
                          © ${new Date().getFullYear()} FlowBoard
                        </p>

                        <p style="
                          margin: 6px 0 0;
                          font-size: 11px;
                          color: #a1a1aa;
                        ">
                          Ta wiadomość została wysłana automatycznie. Prosimy na nią
                          nie odpowiadać.
                        </p>

                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>

          </body>
          </html>
          `,
    });

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: token,
        expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ message: "Wysłano prośbę" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Wystąpił błąd" }, { status: 500 });
  }
}

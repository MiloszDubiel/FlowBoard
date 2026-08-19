import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("Nie znaleziono JWT_SECRE");
}

// TextEncoder zamienia zwykły string na dane binarne,
// których potrzebuje biblioteka jose.

const encodedSecret = new TextEncoder().encode(secret);

//Tworzy JWT dla użytkownika

export async function createToken(userID: number) {
  //Tworzenie nowego tokenu

  //Tworzy ładuenk Tokena
  return new SignJWT({
    userID,
  })
    .setProtectedHeader({
      alg: "HS256", //Sposób podpisu algorytmeme
    })
    .setIssuedAt()
    .setExpirationTime("15m") //Czas waznosci tokena
    .sign(encodedSecret); //Podpiswyanie tokena sekretem
}

export async function verifyToken(token: string) {
  // jwtVerify sprawdza:
  // 1. czy token ma poprawną strukturę
  // 2. czy podpis jest poprawny
  // 3. czy token nie wygasł
  const { payload } = await jwtVerify(token, encodedSecret);

  return payload;
}

export async function requireAuth() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Brak autoryzacji");
  }

  try {
    const payload = await verifyToken(token);

    return payload;
  } catch {
    throw new Error("Brak autoryzacji");
  }
}

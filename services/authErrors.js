export function authErrorMessage(code){
    if(code === 'auth/email-already-in-use') return 'Энэ имэйлээр аль хэдийн бүртгүүлсэн байна.'
    if(code === 'auth/auth/invalid-email') return 'Имэйл хаягаа зөв оруулна уу.'
    if (code === 'auth/weak-password') return 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.'
    if (code === 'auth/invalid-credential') return 'Имэйл эсвэл нууц үг буруу байна.'
    if (code === 'auth/user-not-found') return 'Бүртгэл олдсонгүй, шинээр бүртгүүлнэ үү.'
    if (code === 'auth/wrong-password') return 'Имэйл эсвэл нууц үг буруу байна.'
    if (code === 'auth/too-many-requests') return 'Too many requests. Түр хүлээгээд дахин оролдоно уу.'
    return 'Алдаа гарлаа. Дахин оролдоно уу.'
}
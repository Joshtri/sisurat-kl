import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token dan password wajib diisi' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Find user with matching reset token that hasn't expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token belum expired
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid atau sudah kedaluwarsa' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,        // Clear reset token
        resetTokenExpiry: null,  // Clear expiry
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diperbarui',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
}
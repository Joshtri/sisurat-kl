import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ success: false, message: 'Token tidak valid' }, { status: 400 })
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

    return NextResponse.json({
      success: true,
      message: 'Token valid',
    })
  } catch (error) {
    console.error('Verify reset token error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
}
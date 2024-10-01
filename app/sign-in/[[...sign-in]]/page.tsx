'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import Logo from "../../../components/assets/inverted_logo.png"

export default function SignInPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-100 px-4">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="w-full space-y-6 rounded-2xl bg-green-900 px-4 py-10 bg-opacity-90 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8"
        >
          <header className="text-center">
            <img src={Logo.src} alt="Logo"  className="mx-auto h-20 w-auto" />
            <h1 className="mt-4 text-2xl font-medium tracking-tight text-zinc-50">
              Sign in to Serenity
            </h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <div className="space-y-4">
            <Clerk.Field name="identifier" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-200">Email</Clerk.Label>
              <Clerk.Input
                type="email"
                required
                className="w-full rounded-md bg-zinc-100 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <Clerk.Field name="password" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-200">Password</Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full rounded-md bg-zinc-100 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-800 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
          </div>
          <SignIn.Action
            submit
            className="w-full rounded-md bg-zinc-800 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
          >
            Sign In
          </SignIn.Action>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-green-800 bg-opacity-70 px-2 text-zinc-200">Or continue with</span>
            </div>
          </div>

          <Clerk.Connection
            name="google"
            className="flex w-full items-center justify-center gap-x-3 rounded-md bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-950 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Clerk.Connection>

          <p className="text-center text-sm text-zinc-200">
            Don&apos;t have an account?{' '}
            <a
              href="/sign-up"
              className="font-medium text-white text-base decoration-zinc-950/20 underline-offset-4 outline-none hover:text-white hover:underline focus-visible:underline"
            >
              Sign up
            </a>
          </p>
        </SignIn.Step>
        <SignIn.Step
          name="verifications"
          className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8"
        >
          <SignIn.Strategy name="email_code">
            <header className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 40 40"
                className="mx-auto size-10 text-zinc-950"
                aria-hidden
              >
                <mask id="a" width="40" height="40" x="0" y="0" maskUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
                </mask>
                <g fill="currentColor" mask="url(#a)">
                  <path d="M43.5 3a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V2ZM43.5 8a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V7ZM43.5 13a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 18a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 23a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 28a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 33a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 38a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1Z" />
                </g>
              </svg>
              <h1 className="mt-4 text-xl font-medium tracking-tight text-zinc-950">
                Verify email code
              </h1>
            </header>
            <Clerk.GlobalError className="block text-sm text-red-400" />
            <Clerk.Field name="code" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-950">Email code</Clerk.Label>
              <Clerk.Input
                type="otp"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <SignIn.Action
              submit
              className="w-full rounded-md bg-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
            >
              Verify
            </SignIn.Action>
          </SignIn.Strategy>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  )
}

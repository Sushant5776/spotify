// types imports
import { GetServerSideProps } from 'next'

// imports
import { getProviders, signIn } from 'next-auth/react'

const Login = ({ providers }) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      <img className="mb-5 w-52" src="https://links.papareact.com/9xl" alt="" />
      {Object.values(JSON.parse(providers)).map((provider) => (
        <div key={provider.name}>
          <button
            onClick={() => signIn(provider.id, { callbackUrl: '/' })}
            className="rounded-lg bg-[#18D860] p-5 text-white"
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  )
}

export default Login

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()

  return {
    props: {
      providers: JSON.stringify(providers),
    },
  }
}

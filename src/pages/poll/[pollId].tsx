import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import { api } from '~/utils/api'

function Poll() {
  const [answers, setAnswerId] = useState<string | null>()
  const router = useRouter()
  const { pollId } = router.query as { pollId: string }
  const { isLoading, data } = api.poll.getPoll.useQuery({ pollId }, {
    enabled: !!pollId
  })

  const { mutateAsync } = api.poll.submitResponse.useMutation({
    onSuccess(data, variables, context) {
      // console.log({ data, variables, context })
      console.log('success submit')
    },
  })

  const handlerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!answers) return
    mutateAsync({
      answer_id: answers
    }).catch(console.error)
  }
  console.log(data)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      {isLoading ?
        <p>isLoading...</p> :
        <section>
          <h1 className='text-white text-3xl'>{data?.prompt}</h1>
          <form onSubmit={handlerSubmit}>
            {data?.answers.map(a => (
              <fieldset key={a.id} className='text-white'>
                <input
                  id={a.id}
                  type="radio"
                  value={a.id} onChange={() => setAnswerId(a.id)}
                  checked={answers === a.id}
                />
                <label htmlFor={a.id}>{a.text}</label>
              </fieldset>
            ))}

            <button
              type='submit'
              className='bg-blue-300 text-white w-full text-xl py-2 hover:bg-blue-500 cursor-pointer disabled:hover:bg-blue-300'
              disabled={!answers}
            >submit</button>
          </form>
        </section>
      }
    </main >
  )
}

export default Poll
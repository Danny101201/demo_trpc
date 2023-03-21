import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'
import { prisma } from '~/server/db'
import { api } from '~/utils/api'

function Poll() {
  const [answers, setAnswerId] = useState<string | null>()
  const router = useRouter()
  const { pollId } = router.query as { pollId: string }
  const [hasAnswer, setHaAnswer] = useState<boolean>()
  const untils = api.useContext()
  const { isLoading, data, refetch } = api.poll.getPoll.useQuery({ pollId }, {
    enabled: !!pollId
  })
  useEffect(() => {
    setHaAnswer(!!localStorage.getItem(pollId))
  }, [pollId])

  const { mutateAsync } = api.poll.submitResponse.useMutation({
    onSuccess(data, variables, context) {
      untils.poll.getPoll.invalidate()
      console.log('success submit', data, variables, context)
    },
  })

  const handlerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!answers) return
    mutateAsync({
      answer_id: answers
    })
      .catch(console.error)
      .finally(() => {
        refetch()
        localStorage.setItem(pollId, 'true')
      })
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      {isLoading ?
        <p>isLoading...</p> :
        <section>
          <h1 className='text-white text-3xl'>{data?.prompt}</h1>
          {hasAnswer && (
            <div>
              {data?.answers.map((item) => (
                <div key={item.id} className='text-white'>{item.text} : {item._count.responses} votes</div>
              ))}
            </div>
          )}
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
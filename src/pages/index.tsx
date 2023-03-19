import Head from 'next/head'
import { motion } from "framer-motion"
import { useState, useRef } from 'react'
const controller = new AbortController
const {signal} = controller 
export default function Home() {
  const scrollWrapper = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false);
  const [generatedDescs, setGeneratedDescs] = useState<string>("");
  const [desc, setDesc] = useState("");
  const [genBoxState,setGenBoxState] = useState(false)
  const defultDesc = '假设我们是朋友，当我和你说话时你要严格的按照先说一声“这是给你的赛博拥抱”然后再说一些安慰的话的形式生成一片小短文'
  let text = desc || defultDesc

  const prompt = `假设我们是朋友，当我和你说话时你要严格的按照先说一声“这是给你的赛博拥抱”然后再说一些安慰的话的形式生成一片小短文，内容关于:${text}${text.slice(-1) === "." ? "" : "."}`
  const generateDesc = async (e: any) => {
    const controller = new AbortController();
    const signal = controller.signal;
    setGenBoxState(true)
    e.preventDefault();
    setGeneratedDescs("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedDescs((prev) => prev + chunkValue);
    }

    setLoading(false);
  };
  const clearInput = () => {
    setDesc('')
  }
  const stopGenerate = ()=>{
    controller.abort()
    setLoading(false)
  }
  return (
    <>
      <Head>
        <title>Hug</title>
        <meta name="description" content="Give you a hug !" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/hug.svg" />
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1}}
        transition={{duration: 0.5 }}
      >
      <p className='font-sans font-bold text-2xl italic fixed top-0 left-0 p-5 text-black dark:text-white hover:scale-110 transition-all ease-in-out'>Hug</p>
      </motion.div>
      <main className='bg-white dark:bg-neutral-900 w-screen h-screen'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}>
          <section className='flex flex-col items-center '>
            <section className='flex flex-col items-center justify-center mt-40 mb-5 w-4/5 md:1/2 lg:w-3/5 xl:w-1/3 transition-all'>
              <section className='text-xl xl:text-xl font-sans text-left w-full font-bold transition-all mt-5'>
                <p className='text-black dark:text-white'>
                  在你需要时，生成一个赛博拥抱和一段安慰语。
                </p>
              </section>
              {!loading ? (<section className='w-full mt-3 flex transition-all'>
                <input
                  className='flex-grow flex-shrink p-4 h-12 rounded text-black dark:text-white bg-gray-100 dark:bg-neutral-800 hover:opacity-80 focus:outline-none  focus:border-neutral-600 focus:ring-2 focus:ring-neutral-600 transition-all'
                  type="text"
                  placeholder={'请给我一些安慰...'}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
                <button className='flex-shrink w-20 text-xs md:text-base md:w-24 h-12 mr-2 ml-2 rounded text-black dark:text-white hover:opacity-80 bg-gray-100 dark:bg-neutral-800  font-bold transition-all'
                  onClick={(e) => { generateDesc(e) }}>生成
                </button>
                <button 
                  disabled = {desc?false:true}
                  className='disabled:opacity-30 flex-shrink text-xs md:text-base w-20 md:w-24 h-12 rounded text-black dark:text-white hover:opacity-80 bg-gray-100 dark:bg-neutral-800  font-bold transition-all'
                  onClick={clearInput}>清空
                </button>
              </section>):(<section className='w-full'>
                  <div
                  className='flex items-center justify-center relative mt-3 w-full text-xs md:text-base h-12 rounded text-black dark:text-white  dark:bg-neutral-800  bg-gray-100 font-bold transition-all animate-pulse'
                  >
                    生成中...
                     <button className='bg-gray-200 dark:bg-neutral-700 h-8 w-20 rounded text-xs absolute right-2 top-2'
                     onClick={stopGenerate}>
                      停止生成
                    </button>
                  </div>
                </section>)}
{/*               
                <section>
                  <button>
                    生成中
                  </button>
                </section> */}
            </section>
            {genBoxState?(<section
             className='flex flex-col items-center w-4/5 md:1/2 lg:w-3/5 xl:w-1/3 transition-all'>
              <section className='w-full h-auto bg-gray-100 dark:bg-neutral-800 rounded p-5 text-left transition-all '>
                <p className='font-sans text-black dark:text-white'>
                  {generatedDescs}
                </p>
              </section>
              {/* <button onClick={prevPage} className='border h-10 font-bold rounded-xl text-white hover:opacity-80 bg-black transition-all mt-5 '>
            {loading && (
              <p>生成中...</p>
            )
            }
            {!loading && (
              <p>我需要更多安慰</p>
            )
            }
              </button > */}
            </section>):null}
            
          </section>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1}}
          transition={{ duration: 0.5 }}
        >
          <p className='text-xs opacity-70 fixed p-5 text-black dark:text-white bottom-0'>made by <a rel='noopener noreferrer' target={'_blank'} href="https://ekar.site/">ekar</a><span className='mr-2 ml-2'>|</span>
          <a rel='noopener noreferrer' className='border-b border-dashed hover:opacity-70 transition-all text-xs' href='https://github.com/Ekarmore/hug' target={'_blank'}>Github</a></p>
        </motion.div>
      </main>
    </>
  )
}

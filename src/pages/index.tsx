import Head from 'next/head'
// import styles from '@/styles/Home.module.css'
import { motion } from "framer-motion"
import { useState, useRef } from 'react'
export default function Home() {
  const scrollWrapper = useRef<HTMLDivElement>(null)
  console.log(scrollWrapper);
  const [loading, setLoading] = useState(false);
  const [generatedDescs, setGeneratedDescs] = useState<string>("");
  const [desc, setDesc] = useState("");
  const defultDesc = '假设我们是朋友，当我和你说话你要严格的按照先说一声“这是给你的赛博拥抱”然后再说一些安慰的话的形式生成一片小短文'
  let text = desc || defultDesc

  const prompt = `假设我们是朋友，当我和你说话你要严格的按照先说一声“这是给你的赛博拥抱”然后再说一些安慰的话的形式生成一片小短文，内容关于:${text}${text.slice(-1) === "." ? "" : "."}`
  const generateDesc = async (e: any) => {
    e.preventDefault();
    scrollWrapper.current?.scrollBy({ top: 10, left: 0, behavior: 'smooth' })
    setGeneratedDescs("");
    setLoading(true);
    const response = await fetch("/api/generate", {
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
  const prevPage = () => {
    scrollWrapper.current?.scrollBy({ top: -10, left: 0, behavior: 'smooth' })
  }
  return (
    <>
      <Head>
        <title>Hug</title>
        <meta name="description" content="Give you a hug !" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main ref={scrollWrapper} className='h-screen overflow-y-scroll snap-y snap-mandatory'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <section className='flex flex-col items-center justify-center h-screen snap-center'>
            <div className='transition-all flex items-center fixed top-5 w-5/6 md:w-2/3 xl:w-1/2 lg:w-2/3 p-2 bg-white/30 backdrop-filter backdrop-blur-lg border-b border-black'>
              <p className='text-2xl font-sans font-bold'>Hug</p>
            </div>
            <section className='text-2xl md:text-2xl font-sans font-bold  w-4/5 md:w-3/5 xl:w-2/5 lg:w-2/5 transition-all mb-5'>
              <p>
                在你需要时，生成一个赛博拥抱和一段安慰语。
              </p>
            </section>
            {/* <hr className='w-4/5 md:w-3/5 xl:w-2/5 lg:w-2/5 transition-all mt-5 mb-5 border-black' /> */}
            <section className='w-4/5 md:w-3/5 xl:w-2/5 lg:w-2/5 mx-auto transition-all'>
              <div className='flex items-center font-sans mb-4'>
                {/* <span className='font-sans bg-black text-white w-6 h-6 mr-2 flex items-center justify-center rounded-full'>1</span> */}
                <p className=' font-bold'>首先,请用几句简单描述你的经历</p>
              </div>
              <textarea className='p-5 h-80 w-full rounded-md border border-black focus:outline-none  focus:border-black focus:ring-2 focus:ring-black'
                placeholder={'给我一些安慰'}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </section>
            <button className='w-4/5 md:w-3/5 xl:w-2/5 lg:w-2/5 border h-10 rounded-xl text-white hover:opacity-80 bg-black font-bold transition-all mt-5'
              onClick={(e) => { generateDesc(e) }}>生成 &rarr;
            </button>
          </section>
        </motion.div>
        <section className='flex flex-col items-center h-screen justify-center snap-center relative'>
          <div className='w-4/5 md:w-3/5 xl:w-2/5 lg:w-2/5'>
          <p className='text-start text-2xl font-bold mb-5  '>生成的安慰语</p>
          </div>
          <section className='bg-white rounded-xl p-5 hover:bg-gray-100 transition cursor-copy border border-black text-left w-4/5 md:w-3/5 xl:w-2/5 lg:w-2/5 h-96 '>
            <p className='font-sans'>
              {generatedDescs}
            </p>
          </section>
          <button onClick={prevPage} className='w-4/5 md:w-3/5 xl:w-2/5 lg:w-2/5 border h-10 font-bold rounded-xl text-white hover:opacity-80 bg-black transition-all mt-5 '>
            {loading && (
              <p>生成中...</p>
            )
            }
            {!loading && (
              <p>我需要更多安慰</p>
            )
            }
          </button >
          <p className='text-center text-sm md:text-start w-4/5 md:w-3/5 xl:w-2/5 lg:w-2/5 absolute bottom-5'>Powered by <a href='https://platform.openai.com/overview' target={'_blank'} className='font-sans font-bold p-1' rel="noreferrer">OpenAI</a>+<a href='https://nextjs.org/' target={'_blank'} className='font-bold font-sans p-1' rel="noreferrer">Next.js</a>+<a href='https://vercel.com/' target={'_blank'} className='font-sans font-bold p-1' rel="noreferrer">Vercel</a></p>
        </section>
      </main>
    </>
  )
}

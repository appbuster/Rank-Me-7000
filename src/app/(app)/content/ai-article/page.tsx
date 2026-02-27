import { Suspense } from 'react'
import { getTopicIdeas } from '@/lib/data/content'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'

async function AIArticleData() {
  const topics = await getTopicIdeas({ limit: 10 })

  const kpis = [
    { title: 'Articles Generated', value: '47' },
    { title: 'Avg. Word Count', value: '2,150' },
    { title: 'Avg. SEO Score', value: '85' },
    { title: 'Published', value: '32' },
  ]

  return (
    <div className="space-y-6">
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Generate New Article</h3>
        <form className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Topic or Target Keyword
            </label>
            <input
              type="text"
              id="topic"
              placeholder="e.g., best project management software"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                Tone
              </label>
              <select
                id="tone"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
              >
                <option>Professional</option>
                <option>Conversational</option>
                <option>Academic</option>
                <option>Casual</option>
              </select>
            </div>
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                Target Length
              </label>
              <select
                id="length"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
              >
                <option>Short (800-1000 words)</option>
                <option>Medium (1500-2000 words)</option>
                <option>Long (2500-3000 words)</option>
                <option>Comprehensive (4000+ words)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Article Type</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {['How-to Guide', 'Listicle', 'Comparison', 'Review', 'News', 'Opinion'].map(
                (type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input type="radio" name="type" value={type} className="text-blue-600" />
                    <span className="text-sm">{type}</span>
                  </label>
                )
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            ✨ Generate Article with AI
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Suggested Topics</h3>
        <p className="mb-4 text-sm text-gray-500">
          Based on trending keywords and content gaps
        </p>
        <div className="space-y-3">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
            >
              <div>
                <p className="font-medium">{topic.topic}</p>
                <p className="text-sm text-gray-500">
                  {topic.volume.toLocaleString()} monthly searches • KD: {topic.difficulty}
                </p>
              </div>
              <button className="rounded-lg border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50">
                Use Topic
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AIArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Article Writer</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate SEO-optimized articles with AI assistance
        </p>
      </div>

      <Suspense
        fallback={
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-lg bg-gray-200" />
              ))}
            </div>
            <div className="h-64 rounded-lg bg-gray-200" />
          </div>
        }
      >
        <AIArticleData />
      </Suspense>
    </div>
  )
}

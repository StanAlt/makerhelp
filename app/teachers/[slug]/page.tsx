export default function TeacherProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Teacher Profile: {params.slug}</h1>
      <p className="text-gray-500">Teacher profile coming in Step 6</p>
    </main>
  )
}

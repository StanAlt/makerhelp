export default function BookingPage({
  params,
}: {
  params: { teacherId: string }
}) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Book a Session</h1>
      <p className="text-gray-500">Booking flow coming in Step 7</p>
    </main>
  )
}

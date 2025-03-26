import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/report/z')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/report/z"!</div>
}

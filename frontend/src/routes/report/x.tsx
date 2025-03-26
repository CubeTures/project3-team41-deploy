import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/report/x')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/report/x"!</div>
}

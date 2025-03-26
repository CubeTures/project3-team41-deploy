import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/report/profit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/report/profit"!</div>
}

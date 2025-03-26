import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/report/items')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/report/items"!</div>
}

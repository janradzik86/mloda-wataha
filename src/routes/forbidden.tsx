import { createFileRoute } from "@tanstack/react-router";
import { ForbiddenScreen } from "@/components/auth/forbidden-screen";

export const Route = createFileRoute("/forbidden")({
  component: () => <ForbiddenScreen canBootstrap={false} booting={false} />,
});

import { Suspense } from "react";
import { PresenterView } from "@/components/presenter/PresenterView";

export default function PresentPage() {
	return (
		<Suspense>
			<PresenterView />
		</Suspense>
	);
}

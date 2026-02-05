interface Props {
  params: {
    formId: string;
  };
}

export default async function FormDetailPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-xl font-medium">Form: {params.formId}</h1>
    </div>
  );
}

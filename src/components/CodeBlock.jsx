function CodeBlock({ code }) {

  return (

    <pre className="bg-black/60 p-6 border border-white/10 rounded-lg overflow-x-auto text-sm">

      <code>
        {code}
      </code>

    </pre>

  );

}

export default CodeBlock;
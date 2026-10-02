export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border px-4 py-8 pb-24 text-center text-xs text-muted-foreground md:pb-8">
      <p>
        Este site usa a API do{" "}
        <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="underline">
          TMDB
        </a>
        , mas não é endossado nem certificado pelo TMDB.
      </p>
      <p className="mt-1">
        Dados de onde assistir fornecidos por{" "}
        <a href="https://www.justwatch.com/br" target="_blank" rel="noopener noreferrer" className="underline">
          JustWatch
        </a>
        .
      </p>
    </footer>
  );
}

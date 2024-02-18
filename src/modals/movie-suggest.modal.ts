import { App, SuggestModal } from "obsidian";
import { Movie, Search, TMDB } from "tmdb-ts";

export class MovieSuggestModal extends SuggestModal<Movie> {
  constructor(
    app: App,
    private tmdbApiKey: string,
    private onMovieChosen: (item: Movie) => void,
  ) {
    super(app);
    this.setPlaceholder("Search for a movie...");
  }

  async getSuggestions(query: string): Promise<Movie[]> {
    // For now, we instantiate the client on demand, but this is probably not necessary
    const tmdb = new TMDB(this.tmdbApiKey);

    try {
      const movieSearchResult: Search<Movie> = await tmdb.search.movies({
        query,
      });
      return movieSearchResult.results;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  renderSuggestion(value: Movie, el: HTMLElement) {
    el.appendText(`${value.title} (${value.release_date})`);
  }

  onChooseSuggestion(item: Movie, evt: MouseEvent | KeyboardEvent) {
    this.onMovieChosen(item);
    // TODO: You also have access to the editor so...
    const cursorPosition = this.app.workspace.activeEditor?.editor?.getCursor();
    
    const testJsonCode = {
      movie: item.title,
      releaseYear: Number(item.release_date.substring(0, 4)),
      description: item.overview,
    };

    this.app.workspace.activeEditor?.editor?.replaceSelection(
      "```tmdb\n" +
      JSON.stringify(testJsonCode) + "\n" +
      "```"
    );

    // this.app.workspace.activeEditor?.editor?.replaceSelection(
    //   `[${item.title}](https://www.themoviedb.org/movie/${item.id})`,
    // );
  }
}

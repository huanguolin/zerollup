import * as path from 'path'
import {Tokenizer, regExpEscape} from './Tokenizer'

export interface TSOptions {
    paths?: Record<string, string[]>
    baseUrl?: string
    exclude?: string[] | void
}

export const winSepRegex = new RegExp(regExpEscape(path.sep), 'g')
export const posixSepRegex = /\//g

export class ImportPathsResolver {
    private tokenizers: Tokenizer[]

    constructor(
        opts: TSOptions
    ) {
        const paths = opts.paths || {}
        const baseUrl = opts.baseUrl ? opts.baseUrl.replace(winSepRegex, '\/') : null

        const mapBaseUrl: ((v: string) => string) | void = baseUrl
            ? sub => (sub[0] === '/'
                ? sub
                : `${baseUrl}/${sub.substring(0, 2) === './' ? sub.substring(2) : sub}`
            )
            : null

        this.tokenizers = Object.keys(paths)
            .filter(key => !opts.exclude || !opts.exclude.includes(key))
            .map(key => new Tokenizer(
                key,
                mapBaseUrl ? paths[key].map(mapBaseUrl) : paths[key]
            ))
    }

    getImportSuggestions(oldImport: string, fileName: string): string[] | void {
        for (let tokenizer of this.tokenizers) {
            const match = tokenizer.parse(oldImport)
            if (match) {
                return match.map(p => {
                    const newPath = path.relative(
                        fileName,
                        p.replace(posixSepRegex, path.sep)
                    ).replace(winSepRegex, '\/')

                    return newPath[0] !== '.' ? ('./' + newPath) : newPath
                })
            }
        }
    }
}

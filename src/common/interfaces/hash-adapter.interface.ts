

export interface HashAdapter {
    
    hash(password: string): string

    compare(password: string, prevHash: string): boolean
}
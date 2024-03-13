export function generateUserName(firstName: string, lastName: string): string {
    const firstInitial = firstName.trim().charAt(0).toLocaleLowerCase();
    const formattedLastName = lastName.trim().toLowerCase();
    const randomDigits = Math.floor(Math.random() * 900) + 100;
    const username = `${firstInitial}${formattedLastName}_${randomDigits}`;
    return username;
}
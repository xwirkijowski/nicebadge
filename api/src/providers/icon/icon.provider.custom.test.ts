import { expect, test, describe } from 'vitest';
import CustomIconProvider from "@/providers/icon/icon.provider.custom";
import {Icon} from "@/providers/icon/icon";

describe("CustomIconProvider Tests", () => {
    const provider = new CustomIconProvider();

    test("Can decode base64 without losing data/characters", async () => {
        expect(await provider.resolve(
            new Icon(
                "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGJhc2VQcm9maWxlPSJmdWxsIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZWQiIC8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI4MCIgZmlsbD0iZ3JlZW4iIC8+PHRleHQgeD0iMTUwIiB5PSIxMjUiIGZvbnQtc2l6ZT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj5TVkc8L3RleHQ+PC9zdmc+",
            )
        )).toBe([
            '<svg version="1.1" baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="100%" height="100%" fill="red" />',
            '<circle cx="150" cy="100" r="80" fill="green" />',
            '<text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>',
            '</svg>'
        ].join(''))
    })

    describe("Rejects when expected", () => {
        test.concurrent("No index 1 after encoded data split", async () => {
            await expect(async () => await provider.resolve(
                new Icon(
                    "data:image/svg;base64",
                )
            )).rejects.toThrowError();
        });
        test.concurrent("No `data:image`", async () => {
            await expect(async () => await provider.resolve(
                new Icon(
                    "test",
                )
            )).rejects.toThrowError();
        });
    })
})